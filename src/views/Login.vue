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
                        :disabled="btnFlag"
                        @click="googleAuth"
                    >Google</v-btn>
                    <p></p>
                    <v-btn
                        color="white"
                        width="50%"
                        class="mb-4"
                        to="/emailForm"
                        :disabled="btnFlag"
                    >E-mail</v-btn>
                </div>
                <h2>or</h2>
                    <v-btn
                        color="white"
                        width="50%"
                        class="mb-8 mt-5"
                        to="/addAccount"
                        :disabled="btnFlag"
                    >メールで新規登録</v-btn>
            </v-card-text>
            
        </v-card>
    </v-container>

</template>

<script>
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";
import db from "../plugins/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default {
    data(){
        return{
            data:null,
            btnFlag:false
        }
    },
    methods:{
        googleAuth(){
            sessionStorage.setItem("loginFlag","login");
            const provider = new GoogleAuthProvider();
            const auth = getAuth();
            signInWithRedirect(auth,provider);
        },
        async checkData(){
            const docRef = doc(db, "users", sessionStorage.getItem("user"));
            await getDoc(docRef)
            .then((res)=>{
                this.data = res.data();
            })
            .catch((err)=>{
                console.log(err);
            });

            if(this.data == undefined){
                await setDoc(docRef,{
                    uid: sessionStorage.getItem("user"),
                    name:"プロフィールを設定してください",
                    src:"",
                    PRText:"",
                    follow:0,
                    follower:0
                })
                .then(()=>{
                    this.btnFlag = false;
                    this.$router.push("/");
                    this.$router.go({path: this.$router.currentRoute.path, force: true});
                })
                .catch((err)=>{
                    console.log(err);
                    alert("ページを閉じてもう一度操作を行なってください");
                });
            }else{
                this.btnFlag = false;
                this.$router.push("/");
                this.$router.go({path: this.$router.currentRoute.path, force: true});
            }
        }
    },
    mounted(){
        if(sessionStorage.getItem("loginFlag") == "login"){
            const auth = getAuth();
            getRedirectResult(auth)
            .then((result)=>{
                this.btnFlag = true;
                this.$store.state.uid = result.user.uid;
                sessionStorage.setItem('user', this.$store.state.uid);
                this.checkData();
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode+" err: "+errorMessage);
            });
        }
    }
    


}
</script>

<style scoped>
.container{
    height: 100%;
    width: 100%;
    margin-top: 2px;
}
</style>