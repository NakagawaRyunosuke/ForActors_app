<template>
    <v-container>
        <v-icon large @click="back" class="mb-10">mdi-arrow-left</v-icon>
        <div class="list">
            <v-card v-for="(follow,index) in followItems" :key="follow.name">
                <v-row> 
                    <v-col cols=3 class="mt-1">
                        <picture>
                            <source :srcset="follow.src">
                            <img src="../assets/default.png" alt="default" class="img">
                        </picture>
                    </v-col>
                    <v-col cols=6 class="my-auto text-center">
                        <h2>{{ follow.name }}</h2>
                    </v-col>
                    <v-col cols=2 class="my-auto">
                        <v-btn :loading="loadFlag" text @click="delFollow(index)"><v-icon>mdi-delete</v-icon></v-btn>
                    </v-col>
                </v-row>   
            </v-card>
        </div>
    </v-container>
</template>

<script>
import db from "../plugins/firebase";
import { doc, deleteDoc, updateDoc, getDocs, collection } from "firebase/firestore";

export default {
    props:{
        followItems:Array,
    },
    data(){
        return{
            loadFlag:false
        }
    },
    methods:{
        back(){
            this.$emit("back", false);
        },
        async delFollow(index){
            this.loadFlag = true;
            let array = JSON.stringify(this.followItems);
            const myFollowes = JSON.parse(array);
            console.log(myFollowes[index].uid)
            const delFollowDoc = doc(db, "users", sessionStorage.getItem("user"), "followes", myFollowes[index].uid);
            await deleteDoc(delFollowDoc)
            .then(()=>{
                this.followItems.splice(index,1);
            })
            .catch((err)=>{
                console.log(err);
            });

            const delFollowerDoc = doc(db, "users", myFollowes[index].uid, "followers", sessionStorage.getItem("user"));
            await deleteDoc(delFollowerDoc)
            .then(()=>{
                this.loadFlag = false;
            })
            .catch((err)=>{
                console.log(err);
            });

            this.updateFollowes(myFollowes, index);
        },
        async updateFollowes(myFollowes, index){
            const docRef3 = doc(db, "users", sessionStorage.getItem("user"));
            await updateDoc(docRef3,
                {
                    follow:this.followItems.length,
                }
            )
            .catch((err)=>{
                console.log(err);
            });

            const docRef4 = doc(db, "users", myFollowes[index].uid);
            const collectionRef = collection(db, "users", myFollowes[index].uid, "followers");
            let followers = [];
            let followersLength = 0;
            await getDocs(collectionRef)
            .then((res)=>{
                res.forEach((data)=>{
                    followers.push(data.data());
                });
                followersLength = followers.length;
            })
            .catch((err)=>{
                console.log(err);
            });
            await updateDoc(docRef4,
                {
                    follower:followersLength,
                }
            )
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
.list{
    overflow-y: auto;
    overflow-x: hidden;
}
</style>