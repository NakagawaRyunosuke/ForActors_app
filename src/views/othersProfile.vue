<template>
    <v-container>
        <Backbtn class="backBtn"/>
        <h2 class="text-center">{{name}}</h2>
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
                            <img src="../assets/default.png" alt="default" class="img">
                        </picture>
                    </div>
                </v-card>
            </div>
            <div>
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
                    
                    <div class="text-center mt-8">
                        <v-btn text class="mr-14" @click="followBtn"><v-icon>mdi-account-plus</v-icon></v-btn>
                        <v-btn text class="ml-14" @click="messageBtn"><v-icon>mdi-email</v-icon></v-btn>
                    </div>
                    
                </v-card>
            </div>

            <div class="mt-8">
                <v-textarea
                    name="PRText"
                    label="自己紹介・PR・Youtube動画のリンクなど"
                    auto-grow
                    readonly
                    auto-complete
                    :value="this.PRText"
                    rows=1
                ></v-textarea>
            </div>

            <div class="mt-8">
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
                    </div>
                    <v-card-title class="py-4 px-4"><a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></v-card-title>
                    <v-textarea class="mx-4" :value="item.text" readonly></v-textarea>
                </v-card>
            </div>
        </div>
    </v-container>
</template>

<script>
import db from "../plugins/firebase";
import { collection, getDocs, doc, getDoc, query, orderBy } from "firebase/firestore";
import Backbtn from "../components/Backbtn.vue";

export default {
    components:{
        Backbtn,
    },
    data(){
        return{
            otherUid: sessionStorage.getItem("otherUser"),
            name:"",
            src:"",
            follow:0,
            follower:0,
            PRText:"",
            items:[],
            plusItems:[],
            isStar:false,
            isMine:true,
            postFlag:"isSelect",
            starFlag:"",
        }
    },
    methods:{
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
            const collectionRef = collection(db, "users", this.otherUid,"star");
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
        async followBtn(){
            // const collectionRef = collection(db, "users", sessionStorage.getItem("user"), "followes");
        },
        async messageBtn(){

        }
    },
    async mounted(){
        const docRef = doc(db, "users", this.otherUid);
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
            if(ADdata.data().uid === this.otherUid){
                this.items.push(ADdata.data());   
            }
        }); 
        this.getPlusDatas();
    }
}
</script>

<style scoped>
.img{
    background-color: rgba(128, 128, 128, 0.514);
    width: 150px;
    height: 150px;
    border-radius: 100%;
    border: 2px solid rgba(146, 142, 142, 0.729);
}
.container{
    height: 720px;
    width: 100%;
    margin-top: 2px;
    overflow: auto;
    position: relative;
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
.backBtn{
    position: absolute;
    top: 10px;
    left: 10px;
}
</style>
