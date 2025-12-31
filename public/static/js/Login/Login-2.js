// import { getAuth, sendEmailVerification, createUserWithEmailAndPassword } from "firebase/auth";

class TestLogin {
    set_user_data(user){
        let user_data = {
            "email": user.email,
            "displayName": user.displayName,
            "photoURL": user.photoURL,
            "uid": user.uid,
            "emailVerified": user.emailVerified
        }
        let email_verified = user.emailVerified;
        return user_data
    }
    set_session_storage(user_data){
        sessionStorage.setItem('primenotes-user-data', JSON.stringify(user_data));
    }
    on_auth_state_change() {
        let self = this;
        let str_const = 'primenotes-uid';

        firebase.auth().onAuthStateChanged(function(user) {

            if (user != null) {
                let user_data = self.set_user_data(user);
                self.set_session_storage(user_data);    
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
            tosUrl: '../',

        };

        var ui = new firebaseui.auth.AuthUI(firebase.auth());
        return ui.start('#firebaseui-auth-container', uiConfig);

    }
    login_with_email_and_password(email, password){
        let self = this;
        self.switch_loader();
        this.firebase.auth().signInWithEmailAndPassword(email, password)
            .then((user) => {
                // Signed in
                self.switch_loader();
                let user_data = self.set_user_data(user);
                self.set_session_storage(user_data);
                window.location.replace("../index.html");
            })
            .catch((error) => {
                self.switch_loader();
                $("#sign-in-warning").html("<p>" + error.message + "</p>");  
                var errorCode = error.code;
                var errorMessage = error.message;
            });
    }
    create_account(){
        let email = $('#sign-up-email').val();
        let password = $('#sign-up-password').val();
        
        // const auth = getAuth();
        this.firebase.auth().createUserWithEmailAndPassword(email, password)
          .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            // ...
            this.send_verfication();
            
          })
          .catch((error) => {
            $("#sign-up-warning").html("<p>" + error.message + "</p>");  
            // const errorCode = error.code;
            // const errorMessage = error.message;
            
          });
          

    }
    send_verfication(should_redirect_to_index){
        let self = this;
        let auth = this.firebase.auth();
        var actionCodeSettings = {
            url: 'https://primenotes-17aa2.firebaseapp.com/templates/login-2.html',
            handleCodeInApp: false
          };
        self.switch_loader();
        auth.currentUser.sendEmailVerification(actionCodeSettings)
        .then(() => {
            self.switch_loader();
            console.log("verification email sent")
            $("#sign-up-warning").html("<p>" + self.verification_email_sent + "</p>");  
            let sign_in_email = $('#sign-in-email').val();
            if(should_redirect_to_index){
                window.location.href = "../";
            }
        }).catch((error) => {
            self.switch_loader();
            const errorCode = error.code;
            const errorMessage = error.message;
            $("#sign-up-warning").html("<p>" + error.message + "</p>");  
            // ..
          });
    }
    logout() {
        firebase.auth().signOut().then(function() {
            console.log('success');
            window.location.replace("../index.html");
        }, function() {})
    }

    switch_loader(){
        $('#loader').toggleClass('active');
    }
    hide_loader(){
        $('#loader').toggleClass('active');
    }
    init() {
        let self = this;
        self.reset_password_sent_message = "Email sent, kindly visit your email inbox";
        self.verification_email_sent = "Verification email sent, please check your email inbox"; 
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
        $('#sign-up-button').on('click', ()=>{
            let confirm_password =$('#sign-up-reenter-password').val();
            if(confirm_password ===  ''){
                $("#sign-up-warning").html("<p>" + "confirm password field is empty" + "</p>");  
            }
            else{
                self.create_account();    
            }
            
        });

        $('#sign-in-button').on('click', ()=>{
            let sign_in_email = $('#sign-in-email').val();
            let sign_in_password = $('#sign-in-password').val();
            self.login_with_email_and_password(sign_in_email, sign_in_password);
        });
        $("#sign-in-switch").on("click", ()=>{
            $(".sign-in-section").show();
            $(".sign-up-section").hide();
            $(".reset-password-section").hide();
          });
          $("#sign-up-switch").on("click", ()=>{
            $(".sign-in-section").hide();
            $(".sign-up-section").show();
            $(".reset-password-section").hide();
          });

          $('#sign-up-reenter-password').on('keyup', ()=>{
            let confirm_password =$('#sign-up-reenter-password').val();
            let password = $('#sign-up-password').val();
            if(confirm_password !== password && confirm_password !== ''){
                $("#sign-up-warning").html("<p>" + "password and confirm password are not same" + "</p>");  
            }
            else{
                $("#sign-up-warning").html("<p>" + "" + "</p>");  
            }
                
          });

          $("#reset-password").on("click", ()=>{
            $(".sign-in-section").hide();
            $(".sign-up-section").hide();
            $(".reset-password-section").show();
            console.log("password reset clicked");
          });
          $('#reset-password-button').on('click', ()=>{
            let reset_email = $('#reset-password-email').val();
            console.log(reset_email);
            self.switch_loader();
            self.firebase.auth().sendPasswordResetEmail(reset_email).then((res)=>{
                self.switch_loader();
                $('#reset-password-warning').html("<p>" + self.reset_password_sent_message + "</p>");  
                console.log(res);
            }).catch((error)=>{
                self.switch_loader();
                $('#reset-password-warning').html("<p>" + error.message + "</p>");
                console.log(error.code);
                console.log(error.message);
            });


          });

    }
}
$(document).ready(function() {
    new TestLogin().init();
});