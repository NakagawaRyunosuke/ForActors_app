<template>
    <v-container>
        <h2 class="text-center" v-show="!editFlag">{{name}}</h2>
        <v-text-field v-model="name" v-show="editFlag" :rules="fieldRules"></v-text-field>
        <div>
            <div>
                <v-card
                    class="pa-2 transparent"
                    outlined
                    tile
                >
                    <div class="text-center">
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
            </div>
            <div>
                <v-card
                    class="pa-2 transparent mt-4"
                    outlined
                    tile
                >
                    <v-row no-gutters v-show="!editFlag">
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
            </div>
        </div>

        <div class="mt-12">
            <v-textarea
                ref="input"
                name="PRText"
                label="自己紹介・PR・Youtube動画のリンクなど"
                auto-grow
                :readonly="!editFlag"
                auto-complete
                v-model="PRText"
                rows=1
            ></v-textarea>
        </div>

        <div class="mt-8" v-show="!editFlag">
            <div class="d-flex tab">
                <h3 :class="postFlag" @click="moveMineTab">投稿</h3>
                <h3 id="star" :class="starFlag" @click="moveStarTab">お気に入り</h3>
            </div>
            <v-card
                v-show="isMine"
                elevatuon="2"
                v-for="item in items"
                :key="item.dataId"
                class="mb-2"
            >
                <div class="d-flex mt-5" height=40>
                    <v-card-subtitle class="my-auto title">{{ item.date }}</v-card-subtitle>
                    <v-row justify="center">
                        <v-btn
                            class="mt-4 rounded-b-xl"
                            height=60
                            tile
                            elevation="3"
                            color="grey lighten-2"
                            @click="postDelBtn(item.dataId)"
                        ><v-icon large>mdi-delete-forever</v-icon></v-btn>
                    </v-row>
                </div>
                <v-card-title class="py-4 px-4"><a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></v-card-title>
                <v-textarea class="mx-4" :value="item.text" readonly></v-textarea>
            </v-card>

            <v-card
                v-show="isStar"
                elevatuon="2"
                v-for="item in plusItems"
                :key="item.dataId"
                class="mb-2"
            >
                <div class="d-flex mt-5" height=40>
                    <v-card-subtitle class="my-auto title">{{ item.date }}</v-card-subtitle>
                    <v-row justify="center">
                        <v-btn
                            class="mt-4 rounded-b-xl"
                            height=60
                            tile
                            elevation="3"
                            color="grey lighten-2"
                            @click="starDelBtn(item.dataId)"
                        ><v-icon large>mdi-delete-forever</v-icon></v-btn>
                    </v-row>
                </div>
                <v-card-title class="py-4 px-4"><a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></v-card-title>
                <v-textarea class="mx-4" :value="item.text" readonly></v-textarea>
            </v-card>
        </div>

    </v-container>
</template>

<script>
import db from "../plugins/firebase";
import { collection, getDocs, doc, updateDoc, getDoc, query, orderBy, deleteDoc, where } from "firebase/firestore";

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
            items:[],
            plusItems:[],
            postFlag:"isSelect",
            starFlag:"",
            isStar:false,
            isMine:true,
            clickDataId:"",
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
            if(file){
                reader.readAsDataURL(file);
            }else{
                this.src = '';
            }
            reader.onload = () => {
                this.src = reader.result;
            }
            
        },
        moveMineTab(){
            this.postFlag = "isSelect";
            this.isMine = true;
            this.isStar = false;
            this.starFlag = "";
        },
        moveStarTab(){
            this.starFlag = "isSelect";
            this.isStar = true;
            this.isMine = false;
            this.postFlag = "";
        },
        async getPlusDatas(){
            this.plusItems = [];
            const collectionRef = collection(db, "users", sessionStorage.getItem("user"),"star");
            await getDocs(collectionRef)
            .then((res)=>{
                res.forEach((starData)=>{
                    this.plusItems.push(starData.data());
                });
            })
            .catch((err)=>{
                console.log(err)
            });
        },
        async postDelBtn(dataId){
            const collectionRef = collection(db, "audition");
            const q = query(collectionRef, where("dataId", "==", dataId));
            await getDocs(q)
            .then((res)=>{
                res.forEach((data)=>{
                this.clickDataId = data.id;
                });
            })
            .catch((err)=>{
                console.log(err)
            });
            const docRef = doc(db, "audition", this.clickDataId);
            await deleteDoc(docRef)
            .catch((err)=>{
                console.log(err)
            });
            this.refresh();
        },
        async starDelBtn(dataId){
            const collectionRef = collection(db, "users", sessionStorage.getItem("user"), "star");
            const q = query(collectionRef, where("dataId", "==", dataId));
            await getDocs(q)
            .then((res)=>{
                res.forEach((data)=>{
                this.clickDataId = data.id;
                });
            })
            .catch((err)=>{
                console.log(err)
            });
            const docRef = doc(db, "users", sessionStorage.getItem("user"), "star", this.clickDataId);
            await deleteDoc(docRef)
            .catch((err)=>{
                console.log(err)
            });
            this.refresh();

        },
        async refresh(){
            this.items = [];
            this.plusItems = [];
            const collectionRef =  collection(db, "audition");
            const q = query(collectionRef, orderBy("dataId","desc"));
            const ADdatas = await getDocs(q);
            
            ADdatas.forEach((ADdata)=>{
                if(ADdata.data().uid === sessionStorage.getItem("user")){
                    this.items.push(ADdata.data());   
                }
            }); 
            this.getPlusDatas();
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

        const collectionRef =  collection(db, "audition");
        const q = query(collectionRef, orderBy("dataId","desc"));
        const ADdatas = await getDocs(q);
        
        ADdatas.forEach((ADdata)=>{
            if(ADdata.data().uid === sessionStorage.getItem("user")){
                this.items.push(ADdata.data());   
            }
        }); 
        this.getPlusDatas();
    }
}
</script>

<style scoped>
.container{
    height: 720px;
    width: 100%;
    margin-top: 2px;
    overflow: auto;
}

.editBtn{
    text-align: center;
    margin-top: 20px;
}
.imgInput{
    position: absolute;
    top: 45%;
    left: 47%;
}
.inputIcon{
    background-color: rgba(240, 248, 255, 0.748);
    width: 25px;
    height: 30px;
    margin: auto;
    padding: 0;
    border-radius: 100%;
}
picture img{
    background-color: rgba(128, 128, 128, 0.514);
    width: 150px;
    height: 150px;
    border-radius: 100%;
    border: 2px solid rgba(146, 142, 142, 0.729);
}
.cardTitle{
    display: flex;
    margin: auto;
}
.titleItem{
    width: 50%;
    font-size: 25px;
}
.tab h3{
    width: 50%;
    text-align: center;
    border-bottom: 2px solid black;
}
.isSelect{
    background-color: rgba(134, 131, 131, 0.248);
}
</style>