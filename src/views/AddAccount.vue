<template>
    <v-container>
        <v-card>
            <v-card-text class="text-center">
                <h1 class="mb-4">新規登録</h1>
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
                    color="deep-orange lighten-3"
                    @click="addUser"
                >登録</v-btn>
            </v-card-text>
        </v-card>
    </v-container>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

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
        addUser(){
            const auth = getAuth();
            createUserWithEmailAndPassword(auth, this.email, this.password)
            .then((userCredential)=>{
                const user = userCredential.user;
                console.log(user);
                this.$router.push("/login");
            })
            .catch((error)=>{
                const errorCode = error.code;
                const errorMessage = error.message;
                alert(errorCode+":"+errorMessage);
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
    background-color: rgba(216, 245, 216, 0.753);
}

</style>