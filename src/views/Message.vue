<template>
    <div class="list">
        <VueLoading v-show="loadFlag" type="spin" color="#333" :size="{ width: '100px', height: '100px' }"/>
        <div
            class="mt-4"
            v-for="(data,index) in showList"
            :key="`showData-${index}`"
            @click="clickCard(data.uid)"
            elevation="2"
        >
            <v-row> 
                <v-col cols=4>
                    <picture>
                        <source :srcset="data.src">
                        <img src="../assets/default.png" alt="default" class="img">
                    </picture>
                </v-col>

                <v-col cols=8>
                    <div class="d-flex">
                        <h3>{{ data.name }}</h3>
                        <v-spacer></v-spacer>
                        <p class="my-auto mr-2 time">{{ data.time }}</p>
                    </div>
                    
                    <hr>
                    <p class="mt-2">{{ data.text }}</p>
                </v-col>
            </v-row>
            <hr>
        </div>
        
    </div>

</template>

<script>
import { collection, doc, getDoc, getDocs, orderBy, query, where } from '@firebase/firestore';
import db from "../plugins/firebase";
import { VueLoading } from 'vue-loading-template';

export default {
    components:{
        VueLoading
    },
    data(){
        return{
            items1:[],
            items2:[],
            MuserItems:[],
            otherUsers:[],
            showList:[],
            loadFlag:true,
        }
    },
    methods:{
        clickCard(uid){
            sessionStorage.setItem("otherUser",uid);
            this.$router.push("/messageroom");
        }
    },
    async mounted(){
        const collectionRef = collection(db, "messageroom");
        const q1 = query(collectionRef, where("user1", "==", sessionStorage.getItem("user")));
        const q2 = query(collectionRef, where("user2", "==", sessionStorage.getItem("user")));

        await getDocs(q1)
        .then((res)=>{
            res.forEach((data)=>{
                this.items1.push(data.data());
                this.otherUsers.push(data.data().user2);
            });
        })
        .catch((err)=>{
            console.log(err);
        });

        await getDocs(q2)
        .then((res)=>{
            res.forEach((data)=>{
                this.items2.push(data.data());
                this.otherUsers.push(data.data().user1);
            });
        })
        .catch((err)=>{
            console.log(err);
        });
        this.MuserItems = this.items1.concat(this.items2);
        
        for(let i = 0; i < this.otherUsers.length; i++){
            let obj = {text:"", src:"", time:"", name:"", uid:""};
            let first = true;
            const docRef = doc(db, "users", this.otherUsers[i]);
            const collectionRef = collection(db, "messageroom", this.MuserItems[i].roomId, "messages");
            const q = query(collectionRef, orderBy("time", "desc"));
            await getDocs(q)
            .then((res)=>{
                res.forEach((data)=>{
                    if(first){
                        obj.text = data.data().text;
                        obj.time = data.data().time;
                        first = false;
                    }
                });
            })
            .catch((err)=>{
                console.log(err);
            });

            await getDoc(docRef)
            .then((res)=>{
                obj.src = res.data().src;
                obj.name = res.data().name;
                obj.uid = res.data().uid;
                this.showList.push(obj);
                this.loadFlag = false;
            })
            .catch((err)=>{
                console.log(err);
            });
        }
    }
}
</script>

<style scoped>
.img{
    margin-left: 20px;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    border: 2px solid rgba(146, 142, 142, 0.729);
    background-color: rgba(128, 128, 128, 0.514);
}
.list{
    overflow-y: auto;
    overflow-x: hidden;
}
.time{
    font-size: 10px;
}
</style>