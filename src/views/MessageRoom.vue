<template>
    <v-container>
        
        <v-row>
            <Backbtn :path="'/message'" class="pl-2 mr-auto my-3"/>
            <v-btn text @click="refresh" class="pr-2 ml-auto my-3"><v-icon>mdi-refresh</v-icon></v-btn>
        </v-row>
        <VueLoading v-show="loadFlag" type="spin" color="#333" :size="{ width: '100px', height: '100px' }"/>
        <div class="cards">
            <v-card
                v-for="(item,index) in items"
                :key="`text-${index}`"
                class="mx-4 mt-4"
                elevation=1
            >
                <v-row> 
                    <v-col cols=2>
                        <picture>
                            <source :srcset="item.src">
                            <img src="../assets/default.png" alt="default" class="img">
                        </picture>
                    </v-col>
                    <v-col cols=10>
                        <p class="text">{{item.text}}</p>
                    </v-col>
                </v-row>  
                <p class="date">{{item.time}}</p> 
            </v-card>

        </div>

        <div class="d-flex input">
            <v-textarea :auto-grow="growFlag" :rows="rows" v-model="sendtext"></v-textarea>
            <v-btn class="sendBtn" @click="send" text :disabled="btnFlag" :loading="sendFlag"><v-icon class="ml-2">mdi-send</v-icon></v-btn>
        </div>
    </v-container>
</template>

<script>
import { addDoc, collection, doc, getDoc, getDocs, orderBy, query, where } from '@firebase/firestore';
import Backbtn from "../components/Backbtn.vue";
import db from "../plugins/firebase";
import { VueLoading } from 'vue-loading-template';

export default {
    components:{
        Backbtn,
        VueLoading
    },
    data(){
        return{
            items:[],
            sendtext:"",
            growFlag:true,
            rows:1,
            btnFlag:true,
            sendFlag:false,
            src:"",
            roomId:"",
            loadFlag:true
        }
    },
    methods:{
        async send(){
            this.sendFlag = true;
            const date = new Date();
            const time = date.getFullYear()+"/"+String(date.getMonth()+1).padStart(2,"0")+"/"+String(date.getDate()).padStart(2,"0")+" "+String(date.getHours()).padStart(2,"0")+":"+String(date.getMinutes()).padStart(2,"0")+":"+String(date.getSeconds()).padStart(2,"0");
            const collectionRef = collection(db, "messageroom", this.roomId, "messages");
            await addDoc(collectionRef,{
                text:this.sendtext,
                time:time,
                src:this.src
            })
            .then(()=>{
                this.sendFlag = false;
            })
            .catch((err)=>{
                console.log(err);
            });
            this.refresh();
            this.sendtext = "";
        },
        async refresh(){
            let array = [];
            const collectionRef = collection(db, "messageroom", this.roomId, "messages");
            const q = query(collectionRef, orderBy("time", "desc"));
            await getDocs(q)
            .then((res)=>{
                res.forEach((data)=>{
                    array.push(data.data());
                });
                this.items = array;
            })
            .catch((err)=>{
                console.log(err);
            });
        }
    },
    watch:{
        sendtext:function(){
            if(this.sendtext.length > 0){
                this.btnFlag = false;
                if(this.sendtext.split(/\n/).length >= 5){
                    this.rows = 5;
                    this.growFlag = false;
                }
            }else{
                this.btnFlag = true;
                this.rows = 1;
                this.growFlag = true;
            }
        }
    },
    async mounted(){
        const docRef = doc(db, "users", sessionStorage.getItem("user"));
        await getDoc(docRef)
        .then((res)=>{
            this.src = res.data().src;
        })
        .catch((err)=>{
            console.log(err);
        });

        const roomcollectionRef = collection(db, "messageroom");
        const msgQ1 = query(roomcollectionRef, where("user1", "==", sessionStorage.getItem("user")), where("user2", "==", sessionStorage.getItem("otherUser")));
        const msgQ2 = query(roomcollectionRef, where("user1", "==", sessionStorage.getItem("otherUser")), where("user2", "==", sessionStorage.getItem("user")));
        let array = [];
        await getDocs(msgQ1)
        .then((res)=>{
            res.forEach((data)=>{
                array.push(data.data());
            });
            if(array.length > 0){
                this.roomId = array[0].roomId;
            }
        })
        .catch((err)=>{
            console.log(err);
        });
        
        await getDocs(msgQ2)
        .then((res)=>{
            res.forEach((data)=>{
                array.push(data.data());
            });
            if(array.length > 0){
                this.roomId = array[0].roomId;
            }
        })
        .catch((err)=>{
            console.log(err);
        });

        const collectionRef = collection(db, "messageroom", this.roomId, "messages");
        const q = query(collectionRef, orderBy("time", "desc"));
        await getDocs(q)
        .then((res)=>{
            res.forEach((data)=>{
                this.items.push(data.data());
            })
            this.loadFlag = false;
        })
        .catch((err)=>{
           console.log(err);
        });

        // setInterval(() => {
        //     this.refresh();
        // }, 3000);
    }
  
}
</script>

<style scoped>
.input{
    position: fixed;
    bottom: 0;
    right: 0;
    width: 100%;
    padding: 10px 20px;
    background-color: white;
}
@media screen and (min-width: 1440px) {
	.input{
        width: 82.5%;
        padding: 10px 20px;
        background-color: white;
    }
}
.img{
    margin-left: 20px;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    border: 2px solid rgba(146, 142, 142, 0.729);
    background-color: rgba(128, 128, 128, 0.514);
}
.date{
    font-size: 10px;
    text-align: right;
}
.text{
    white-space: pre-line;
}
.cards{
    height: 70%;
    overflow-y: auto;
    overflow-x: hidden;
}
.container{
    height: 100%;
    width: 100%;
    margin-top: 2px;
    position: fixed;
}
</style>