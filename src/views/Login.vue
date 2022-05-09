<template>
    <v-container>
        <v-card
            elevation="2"
            class="mx-auto mt-4"
        >
            <v-card-text class="text-center">
                <h1 class="mb-4">ログイン</h1>
                <v-divider></v-divider>
                <div class="mx-auto mt-8">
                    <v-btn
                        color="light-green accent-1"
                        width="50%"
                        class="mb-4 mt-5"
                        @click="googleAuth"
                    >Google</v-btn>
                    <p></p>
                    <v-btn
                        color="deep-orange lighten-3"
                        width="50%"
                        class="mb-4"
                        to="/emailForm"
                    >E-mail</v-btn>
                </div>
                <h2>or</h2>
                    <v-btn
                        color="teal lighten-3"
                        width="50%"
                        class="mb-5 mt-5"
                        to="/addAccount"
                    >メールで新規登録</v-btn>
            </v-card-text>
            
        </v-card>
    </v-container>

</template>

<script>
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default {
    mounted(){
        const firebaseConfig = {
        apiKey: process.env.VUE_APP_APIKEY,
        authDomain: process.env.VUE_APP_AUTHDOMAIN,
        projectId: process.env.VUE_APP_PROJECTID,
        storageBucket: process.env.VUE_APP_STORAGEBUCKET,
        messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
        appId: process.env.VUE_APP_APPID
        };
        initializeApp(firebaseConfig);
    },
    methods:{
        googleAuth(){
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            console.log("ok")
            signInWithPopup(auth,provider)
            .then((result)=>{
                console.log(result);
                this.$router.push("/home");
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode+" err: "+errorMessage);
            })
        },
    }
}
</script>

<style scoped>
.container{
    height: 100%;
    width: 100%;
    margin-top: 2px;
    background-color: rgba(216, 245, 216, 0.753);
}

</style>