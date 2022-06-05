<template>
    <v-card class="text-center form" elevation="5">
        <h3 class="text-right" @click="closeForm">X</h3>
        <div>
            <v-text-field label="タイトル" v-model="title"></v-text-field>
            <v-text-field label="サイトのURL" v-model="url"></v-text-field>
            <v-textarea label="募集要項・期限" v-model="text"></v-textarea>
        </div>
        <v-btn @click="post" :loading="loadFlag">投稿</v-btn>
    </v-card>
</template>

<script>
import db from "../plugins/firebase";
import { collection, addDoc, limit, getDocs, query, orderBy } from "firebase/firestore";

export default {
    methods:{
        async refresh(){
            this.$store.state.items = [];
            const collectionRef = collection(db, "audition");
            const q = query(collectionRef, orderBy("dataId", "desc"), limit(30));
            const datas = await getDocs(q);
            datas.forEach((data)=>{
                this.$store.state.items.push(data.data());
            });
        },
        closeForm(){
            if(this.$store.state.postFlag){
                this.$store.state.postFlag = false;
                this.title = "";
                this.text = "";
                this.url = "";
            }
        },
        async post(){
            const docRef = collection(db, "audition");
            const date = new Date();
            const now = String(date.getFullYear())+"/"+String(date.getMonth()+1)+"/"+String(date.getDate());
            if(this.title.length > 0 && this.text.length > 0 && this.url.length > 0){
                this.loadFlag = true;
                await addDoc(docRef,{
                    date:now,
                    title:this.title,
                    url:this.url,
                    text:this.text,
                    uid:sessionStorage.getItem("user"),
                    dataId:date.getTime().toString()
                })
                .then(()=>{
                    this.loadFlag = false;
                    this.refresh();
                })
                .catch((err)=>{
                    alert(err);
                    this.loadFlag = false;
                });
                this.title = "";
                this.text = "";
                this.url = "";
            }else{
                alert("空欄を埋めてください");
            }

        }
    },
    data(){
        return{
            title:"",
            url:"",
            text:"",
            loadFlag:false
        }
    }
}
</script>

<style scoped>
.form{
    position: fixed;
    bottom: 20px;
    right: 2.5px;
    width: 80%;
    padding: 30px 20px;
}
</style>