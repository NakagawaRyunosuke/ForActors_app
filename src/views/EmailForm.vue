<template>
    <v-container>
        <v-card>
            <v-card-text class="text-center">
                <h1 class="mb-4">ログイン</h1>
                <v-divider></v-divider>
                <div class="mx-16 mt-8">
                    <v-text-field
                        label="メールアドレス"
                        :rules="addresRules"
                        v-model="email"
                    ></v-text-field>
                    <v-text-field
                        label="パスワード"
                        :rules="passRules"
                        v-model="password"
                    ></v-text-field>
                </div>
                <v-btn
                    class="mb-6 mt-6"
                    width="30%"
                    @click="login"
                >ログイン</v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import db from "../plugins/firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default {
    data(){
        return{
            addresRules:[
                value => !!value || "メールアドレスを入力してください",
                value => value.indexOf("@")+1 > 1 || "適した場所に「@」を入力してください",
            ],
            passRules:[
                value => !!value || "パスワードを入力してください",
                value => value.length > 7 || "短すぎると危ないですよ。"
                
            ],
            email:"",
            password:""
        }
    },
    methods:{
        login(){
            const auth = getAuth();
            signInWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential)=>{
                const user = userCredential.user;
                this.$store.state.uid = user.uid;
                sessionStorage.setItem('user', this.$store.state.uid);
                this.checkData();
                this.$router.push("/");
                this.$router.go({path: this.$router.currentRoute.path, force: true});
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorCode+":"+errorMessage);
            });
        },
        async checkData(){
            const docRef = doc(db, "users", sessionStorage.getItem("user"));
            const data = await getDoc(docRef);
            if(!data.data()){
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