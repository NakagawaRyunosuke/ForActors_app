<template>
    <v-container class="text-left">
        <h2 class="ml-6" v-show="!editFlag">{{name}}</h2>
        <v-text-field v-model="name" v-show="editFlag" :rules="fieldRules"></v-text-field>
        <v-row no-gutters>
            <v-col>
                <v-card
                    class="pa-2 transparent"
                    outlined
                    tile
                >
                    <div>
                        <picture>
                            <source :srcset="src">
                            <img src="../assets/default.png" alt="default">
                        </picture>
                        <div class="imgInput" v-show="editFlag">
                            <v-file-input
                                hide-input
                                prepend-icon="mdi-image-edit"
                                class="inputIcon"
                                v-model="image"
                                @change="editImg"
                                accept="image/*"
                            ></v-file-input>
                        </div>
                    </div>
                </v-card>
            </v-col>
            <v-col>
                <v-card
                    class="pa-2 transparent mt-4"
                    outlined
                    tile
                >
                    <v-row no-gutters>
                        <v-col class="text-center">
                            <h4>フォロー</h4>
                            <p>{{ follow }}</p>
                        </v-col>
                        <v-col class="text-center">
                            <h4>フォロワー</h4>
                            <p>{{ follower }}</p>
                        </v-col>
                    </v-row>
                    <div class="editBtn">
                        <v-btn @click="editProfile" :loading="loadFlag" color="white"><h4>{{ btnText }}</h4></v-btn>
                    </div>
                </v-card>
            </v-col>
        </v-row>

        <div class="mt-8">
            <v-textarea
                ref="input"
                color="teal"
                name="PRText"
                label="自己紹介・PR・Youtube動画のリンクなど"
                auto-grow
                :readonly="!editFlag"
                auto-complete
                v-model="PRText"
                length=300
                rows=1
            ></v-textarea>
        </div>

    </v-container>
</template>

<script>
import db from "../plugins/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";

export default {
    data(){
        return{
            src:null,
            image:null,
            name:"test太郎",
            PRText:"test",
            follow:0,
            follower:0,
            btnText:"プロフィール編集",
            editFlag:false,
            fieldRules:[
                value => !!value || "名前を空にすることはできません",
                value => value.length < 15 || "14文字以内で入力してください",
            ],
            loadFlag:false,
        }
    },
    methods:{
        editProfile(){
            if(!this.editFlag){
                this.editFlag = true;
                this.btnText = "編集を終了して保存";
            }else{
                if(this.name.length > 0 && this.name.length < 15){
                    this.editFlag = false;
                    this.update();
                    this.loadFlag = false;
                    this.btnText = "プロフィール編集";
                }

            }
            
        },
        async update(){
            this.loadFlag = true;
            const docRef = doc(db, "users", sessionStorage.getItem("user"));
            await updateDoc(docRef,{
                name:this.name,
                src:this.src,
                PRText:this.PRText,
            });
        },
        editImg(){
            const reader = new FileReader();
            const file = this.image;
            console.log(file)
            if(file){
                reader.readAsDataURL(file);
            }else{
                this.src = '';
            }
            reader.onload = () => {
                this.src = reader.result;
            }
            
        }
    },
    //マウント時、プロフィールデータを取得、表示
    async mounted(){
        const docRef = doc(db, "users", sessionStorage.getItem("user"));
        const data = await getDoc(docRef);
        this.name = data.data().name;
        this.src = data.data().src;
        this.PRText = data.data().PRText;
        this.follow = data.data().follow;
        this.follower = data.data().follower;
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
img{
    width: 150px;
    height: 150px;
    border-radius: 100%;
    border: 2px solid rgba(146, 142, 142, 0.729);
}
.editBtn{
    text-align: center;
    margin-top: 20px;
}
.imgInput{
    position: absolute;
    top: 45%;
    left: 40%;
}
.inputIcon{
    background-color: rgba(240, 248, 255, 0.748);
    width: 25px;
    height: 30px;
    margin: auto;
    padding: 0;
    border-radius: 100%;
}
</style>