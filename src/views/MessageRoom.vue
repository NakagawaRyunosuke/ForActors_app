<template>
    <div>
        <Backbtn :path="'/message'"/>
        <div>
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

        <div class="d-flex input mx-5">
            <v-textarea :auto-grow="growFlag" :rows="rows" v-model="sendtext"></v-textarea>
            <v-btn class="sendBtn" @click="send" text :disabled="btnFlag" :loading="sendFlag"><v-icon class="ml-2">mdi-send</v-icon></v-btn>
        </div>
    </div>
</template>

<script>
import { addDoc, collection, doc, getDoc, getDocs } from '@firebase/firestore';
import Backbtn from "../components/Backbtn.vue";
import db from "../plugins/firebase";

export default {
    components:{
        Backbtn,
    },
    data(){
        return{
            items:[],
            sendtext:"",
            growFlag:true,
            rows:1,
            btnFlag:true,
            sendFlag:false,
            src:""
        }
    },
    methods:{
        async send(){
            this.sendFlag = true;
            const date = new Date();
            const time = date.getFullYear()+"/"+(date.getMonth()+1)+"/"+date.getDate()+" "+date.getHours()+":"+date.getMinutes();
            const roomId = sessionStorage.getItem("user")+"@"+sessionStorage.getItem("otherUser");
            const collectionRef = collection(db, "messageroom", roomId, "messages");
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
            this.sendtext = "";
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
        const roomId = sessionStorage.getItem("user")+"@"+sessionStorage.getItem("otherUser");
        const collectionRef = collection(db, "messageroom", roomId, "messages");
        await getDocs(collectionRef)
        .then((res)=>{
            res.forEach(data => {
                this.items.push(data.data());
            });
        })
    }
  
}
</script>

<style scoped>
.input{
    position: absolute;
    bottom: 0;
    width: 90%;
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

</style>