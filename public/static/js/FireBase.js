// import firebase from "../../node_modules/firebase/app";
// import firebase from '../../node_modules/firebase/app';

export class FireBase {
    login() {
        let self = this;

        var uiConfig = {
            signInSuccessUrl: 'CompanyProRecover.html',
            signInOptions: [
                // Leave the lines as is for the providers you want to offer your users.
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                //firebase.auth.GithubAuthProvider.PROVIDER_ID,
                firebase.auth.EmailAuthProvider.PROVIDER_ID,
                //firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ],
            // Terms of service url.
            tosUrl: 'CompanyProRecover.html',
            callBack: () => {
                return false;
            }
        };

        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        return ui.start('#firebaseui-auth-container', uiConfig);

    }
    on_auth_state_change() {
        let self = this;
        let str_const = 'primenotes-user-data';
        let def = $.Deferred();
        let user_data = sessionStorage.getItem(str_const);
        // firebase.auth().onAuthStateChanged(function(user) {
        if (user_data != null && user_data != "null") {
            self.user_data = JSON.parse(user_data);
            // console.log(user_data);
            $('#user-name-section').attr('data-tooltip', "Hey " +
                self.user_data.displayName + " click to Logout");
            
            $($('#user-name-section').children().get(0)).attr('src', self.user_data.photoURL);
            return def.resolve();

        } else {
            // self.login().then(() => {
            //     let uid = self.firebase.auth().getUid();
            //     sessionStorage.setItem('primenotes-uid', uid);
            //     return def.resolve();
            // });
            window.location.href = "templates/login.html";
        }
        // });
        return def.promise();
    }

    logout() {
        firebase.auth().signOut().then(function() {
            // console.log('success');
            sessionStorage.clear();
            window.location.replace("templates/login.html");

        }, function() {})
    }
    init(tsp, to_return_values) {
        tsp.FireBase = this;
        let self = this;
        this.tsp = tsp;
        let def = $.Deferred();
        this.user_data = {};
        // self.tsp.GlobalConstants.firebase_config = $('#firebase-config').val();
        self.firebase_config = self.tsp.GlobalConstants.firebase_config;
        // $('#firebase-config').empty();
        firebase.initializeApp(tsp.GlobalConstants.firebase_config);
        // const firestore = firebase.firestore();
        // const settings = {
        //     timestampsInSnapshots: true,
        // };
        // firestore.settings(settings);

        this.firebase = firebase;

        this.on_auth_state_change().then(() => {
            return def.resolve(tsp, to_return_values);
        });
        return def.promise();
    }
}
export class QuickNoteFirebase {
    get_inversed_bool_value(str) {
        return (!(str.toLowerCase() == "true")).toString();
    }
    generate_UUID() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0,
                v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    messageHandler(err) {
        if (!!err) {
            console.log(err);
        } else {
            console.log("success");
        }
    }
    get_common_settings_data() {
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();
        self.admin_collection_name = "admin";
        self.admin_document_uuid = "admin-files";
        self.admin_collection_uuid = "common-setting";
        self.admin_file_1 = "file-1";


        db.collection(self.admin_collection_name)
            .doc(self.admin_document_uuid)
            .collection(self.admin_collection_uuid)
            .doc(self.admin_file_1).get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    console.log(doc.id);
                    console.log(doc.data());

                });
            });
    }
    _create_file_in_backend_duplicate(file_details,
        if_welcome_file) {
        // baseCollectionName, userId, QuickNoteConst, FileId
        let self = this;
        let file_uuid = self.generate_UUID();
        let def = $.Deferred();
        var db = self.tsp.FireBase.firebase.firestore();
        let content = "";
        if (if_welcome_file !== undefined) {
            content = self.tsp.GlobalConstants.quick_file_welcome_content;
        } else {
            content = "sample content";
        }

        file_details = {
            name: file_details.file_name,
            content: content,
            date_created: new Date().toGMTString(),
            last_updated: new Date().toGMTString(),
            starred: "false"
        }
        db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.quick_note_const)
            .doc(file_uuid).set(file_details)
            .then((res) => {
                // console.log('file creation success');
                // console.log(res)
                file_details.file_key = file_uuid;
                return def.resolve(file_details);
            }, self.messageHandler);
        return def.promise();
    }

    save_quick_note(savable_data, attrKey) {
        //baseCollectionName, userId, QuickNoteConst, FileId, attrKey, attrValue
        let self = this;
        let def = $.Deferred();
        var db = self.tsp.FireBase.firebase.firestore();
        let attrValue = savable_data[attrKey]
        let fav = savable_data.starred;
        let last_updated = new Date().toGMTString();
        if (attrKey == "starred") {
            fav = self.get_inversed_bool_value(fav);
        }
        let file_details = {
            name: savable_data.name,
            content: savable_data.content,
            date_created: savable_data.date_created,
            last_updated: last_updated,
            starred: fav
        }
        db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.quick_note_const)
            .doc(savable_data.file_key).set(file_details)
            .then(() => {
                // console.log('file updation success');

                return def.resolve(file_details);
            }, self.messageHandler);
        return def.promise();
    }

    read_single_file(file_key) {
        let def = $.Deferred();
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();
        // getAllusers(db, 'users');
        var users = db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.quick_note_const)
            .doc(file_key).get().then((doc) => {
                // console.log(doc.data());
                return def.resolve(doc.data());
            });
        //working code for adding new document [doc id generated dynamically]
        /*db.collection('users').add({ "qwe": "refds" }).then((sanpshot) => {
            snapshot.forEach(doc => {
                console.log(doc.data())
            });
        });*/
        return def.promise();
    }

    _delete_file(file_key) {
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();
        let def = $.Deferred();
        var users = db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.quick_note_const)
            .doc(file_key)
            .delete()
            .then(() => {
                // console.log('file deletion success');
                return def.resolve();
            }, self.messageHandler);
        return def.promise();
    }

    fnGetAllusers(collectionName) {
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();
        //get first level ids
        var ids = db.collection(collectionName).get().then((snapshot) => {
            snapshot.docs.forEach(doc => {
                // console.log(doc.id);
                // console.log(doc.data());
            });
        });
    }

    get_quick_note_list() {
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();
        let file_map = {};
        let def = $.Deferred();
        var users = db.collection(self.base_collection_name)
            .doc(self.user_data.uid)
            .collection(self.tsp.GlobalConstants.quick_note_const)
            .get().then((snapshot) => {
                snapshot.docs.forEach(doc => {
                    // console.log(doc.id);
                    // console.log(doc.data());
                    file_map[doc.id] = doc.data();
                });
                return def.resolve(file_map);
            }, self.messageHandler);
        return def.promise();
    }
    getUUID() {
        q1 = firebase.auth()
        q1.getUid()
    }
    read_common_setting_file() {
        let def = $.Deferred();
        let self = this;
        var db = self.tsp.FireBase.firebase.firestore();
        let uid = "cOCdOleagZX4DIDYs2EH";
        var users = db.collection(self.common_setting_collection_name)
            .doc(uid).get().then((doc) => {
                console.log(doc.data());
                return def.resolve(doc.data());
            });
        return def.promise();
    }
    init(tsp, to_return_values) {
        tsp.QuickNoteFirebase = this;
        this.tsp = tsp;

        this.user_data = this.tsp.FireBase.user_data;
        this.base_collection_name = "users";
        this.common_setting_collection_name = "CommonSettings";
        return $.Deferred().resolve(this.tsp, to_return_values);
    }
}