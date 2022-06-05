<template>
    <div>
        <div>
            <v-text-field
                solo
                clearable
                label="ユーザー名で検索"
                prepend-inner-icon="mdi-account-search"
                v-model="name"
                :loading="loadFlag"
                @keydown.enter="search"
            ></v-text-field>
        </div>

        <div>
            <v-card
                v-for="(user, index) in showUsers"
                :key="index"
                @click="clickCard(index)"
                class="mb-5"
            >
                <v-row> 
                    <v-col cols=4 class="mt-1">
                        <picture>
                            <source :srcset="user.src">
                            <img src="../assets/default.png" alt="default" class="img">
                        </picture>
                    </v-col>

                    <v-col cols=8 class="my-auto">
                        <h2>{{ user.name }}</h2>
                    </v-col>
                </v-row>                   
            </v-card>
        </div>
    </div>

</template>

<script>
import db from "../plugins/firebase";
import { getDocs, collection, query, where } from "firebase/firestore";
export default {
    
    data(){
        return{
            name:"",
            showUsers:[],
            loadFlag:false,
        }
    },
    watch:{
        name: async function(){
            this.showUsers = [];
        }
    },
    methods:{
        clickCard(index){
            sessionStorage.setItem("otherUser",this.showUsers[index].uid);
            if(this.showUsers[index].uid == sessionStorage.getItem("user")){
                this.$router.push("/profile");
            }else{
                this.$router.push("/othersProfile");
            }
        },
        async search(){
            this.loadFlag = true;
            this.showUsers = [];
            const collectionRef = collection(db, "users");
            const q = query(collectionRef, where("name", "==", this.name));
            await getDocs(q)
            .then((res)=>{
                this.loadFlag = true;
                res.forEach((data)=>{
                    this.showUsers.push(data.data());
                });
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
    width: 60px;
    height: 60px;
    border-radius: 100%;
    border: 2px solid rgba(146, 142, 142, 0.729);
    background-color: rgba(128, 128, 128, 0.514);
}
</style>