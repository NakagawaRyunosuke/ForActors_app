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
                        color="white"
                        width="50%"
                        class="mb-4 mt-5"
                        @click="googleAuth"
                    >Google</v-btn>
                    <p></p>
                    <v-btn
                        color="white"
                        width="50%"
                        class="mb-4"
                        to="/emailForm"
                    >E-mail</v-btn>
                </div>
                <h2>or</h2>
                    <v-btn
                        color="white"
                        width="50%"
                        class="mb-8 mt-5"
                        to="/addAccount"
                    >メールで新規登録</v-btn>
            </v-card-text>
            
        </v-card>
    </v-container>

</template>

<script>
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import db from "../plugins/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default {
    methods:{
        googleAuth(){
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            signInWithPopup(auth,provider)
            .then((result)=>{
                console.log(result)
                this.$store.state.uid = result.user.uid;
                sessionStorage.setItem('user', this.$store.state.uid);
                this.checkData();
                this.$router.push("/");
                this.$router.go({path: this.$router.currentRoute.path, force: true});
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorCode+" err: "+errorMessage);
            })
        },
        async checkData(){
            const docRef = doc(db, "users", sessionStorage.getItem("user"));
            const data = await getDoc(docRef);
            if(data.data() == undefined){
                await setDoc(docRef,{
                    uid: sessionStorage.getItem("user"),
                    name:"名無し",
                    src:"",
                    PRText:"",
                    follow:0,
                    follower:0
                });
            }
        }
    },
    


}
</script>

<style scoped>
.container{
    height: 100%;
    width: 100%;
    margin-top: 2px;
}
</style>