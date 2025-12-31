class FireBase {
    on_auth_state_change() {
        let self = this;
        let str_const = 'primenotes-uid';

        firebase.auth().onAuthStateChanged(function(user) {

            if (user != null) {
                let userData = {
                        "email": user.email,
                        "displayName": user.displayName,
                        "photoURL": user.photoURL,
                        "uid": user.uid
                    }
                    let email_verified = user.email_verified;
                    console.log("email verified : ", email_verified);
                    
                    sessionStorage.setItem('primenotes-user-data', JSON.stringify(userData));
                // window.location.href = "../";
            } else {
                
                // window.location.href = "login.html";
            }
        });
    }
    login() {
        let self = this;

        var uiConfig = {
            // callbacks: {
            //     signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            //         // User successfully signed in.
            //         // Return type determines whether we continue the redirect automatically
            //         // or whether we leave that to developer to handle.



            //         return true;
            //     }
            // },
            // signInFlow: 'popup',

            privacyPolicyUrl: '<your-privacy-policy-url>',
            signInSuccessUrl: '../index.html',
            signInOptions: [
                firebase.auth.GoogleAuthProvider.PROVIDER_ID,
                // firebase.auth.FacebookAuthProvider.PROVIDER_ID,
                // firebase.auth.TwitterAuthProvider.PROVIDER_ID,
                // firebase.auth.GithubAuthProvider.PROVIDER_ID,
                // firebase.auth.EmailAuthProvider.PROVIDER_ID,
                //firebase.auth.PhoneAuthProvider.PROVIDER_ID
            ],
            // Terms of service url.
            tosUrl: '../index.html',

        };

        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        return ui.start('#firebaseui-auth-container', uiConfig);

    }

    logout() {
        firebase.auth().signOut().then(function() {
            console.log('success');
            window.location.replace("../index.html");
        }, function() {})
    }
    init() {
        let self = this;
        self.firebase_config = {
            apiKey: "AIzaSyApJRgVPBvyx7VQOcGdPPm_5NlgKVJEtX0",
            authDomain: "primenotes-17aa2.firebaseapp.com",
            databaseURL: "https://primenotes-17aa2-default-rtdb.europe-west1.firebasedatabase.app",
            projectId: "primenotes-17aa2",
            storageBucket: "primenotes-17aa2.appspot.com",
            messagingSenderId: "769006089587",
            appId: "1:769006089587:web:90c4b0595e89dd195f8106",
            measurementId: "G-WDC2R9TFPX"
        };
        firebase.initializeApp(self.firebase_config);
        this.firebase = firebase;
        this.on_auth_state_change();

        this.login();


    }
}
$(document).ready(function() {
    new FireBase().init();
});