<template>
    <v-container>
        <div class="alertWrapper">
            <Alert v-show="alertFlag" class="alert" :text="alertText"/>
        </div>
        <Backbtn class="backBtn" :path="'/search'"/>
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
                    
                    <div class="d-flex mt-8 px-8">
                        <v-btn @click="followBtn" :loading="FbtnLoadFlag" :disabled="followFlag"><v-icon>mdi-account-plus</v-icon>フォロー</v-btn>
                        <v-btn class="ml-10" @click="messageBtn" :loading="MbtnLoadFlag" :disabled="mountFlag"><v-icon>mdi-email</v-icon>メッセージ</v-btn>
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
                    v-for="(item, index) in items"
                    :key="`post-${index}`"
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
                    v-for="(item, index) in plusItems"
                    :key="`star-${index}`"
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
import { collection, getDocs, doc, getDoc, query, orderBy, setDoc, updateDoc,where } from "firebase/firestore";
import Backbtn from "../components/Backbtn.vue";
import Alert from "../components/Alert.vue";

export default {
    props:{
        text:{type:String}
    },
    components:{
        Backbtn,
        Alert
    },
    data(){
        return{
            followFlag:false,
            otherUid: sessionStorage.getItem("otherUser"),
            name:"",
            src:"",
            uid:"",
            follow:0,
            follower:0,
            PRText:"",
            items:[],
            plusItems:[],
            isStar:false,
            isMine:true,
            postFlag:"isSelect",
            starFlag:"",
            msgFlag:false,
            alertText:"",
            alertFlag:false,
            FbtnLoadFlag:false,
            MbtnLoadFlag:false,
            mountFlag:true
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
            this.FbtnLoadFlag = true;
            let follows = [];
            let followers = [];
            const docRef = doc(db, "users", sessionStorage.getItem("user"), "followes", sessionStorage.getItem("otherUser"));
            await setDoc(docRef,
                {
                    name:this.name,
                    src:this.src,
                    uid:this.uid
                }
            )
            .catch((err)=>{
                console.log(err);
            });

            const mineDocRef = doc(db, "users", sessionStorage.getItem("user"));
            let mineDoc = null;
            await getDoc(mineDocRef)
            .then((res)=>{
                mineDoc = res.data();
            })
            .catch((err)=>{
                console.log(err);
            });

            const docRef2 = doc(db, "users", sessionStorage.getItem("otherUser"), "followers", sessionStorage.getItem("user"));
            await setDoc(docRef2, 
                {
                    name: mineDoc.name,
                    src: mineDoc.src
                }
            ).catch((err)=>{
                console.log(err);
            });
            this.FbtnLoadFlag = false;
            this.alertText = "フォローしました";
            this.alertFlag = true;
            setTimeout(()=>{
                this.alertFlag = false;
            },2000);

            const followsCollectionRef = collection(db, "users", sessionStorage.getItem("user"), "followes");
            await getDocs(followsCollectionRef)
            .then((res)=>{
                res.forEach((data)=>{
                    follows.push(data.data());
                });
            })
            .catch((err)=>{
                console.log(err);
            });

            const followersCollectionRef = collection(db, "users", sessionStorage.getItem("otherUser"), "followers");
            await getDocs(followersCollectionRef)
            .then((res)=>{
                res.forEach((data)=>{
                    followers.push(data.data());
                });
            })
            .catch((err)=>{
                console.log(err);
            });

            const docRef3 = doc(db, "users", sessionStorage.getItem("user"));
            await updateDoc(docRef3,
                {
                    follow:follows.length,
                }
            )
            .catch((err)=>{
                console.log(err);
            });

            const docRef4 = doc(db, "users", sessionStorage.getItem("otherUser"));
            await updateDoc(docRef4,
                {
                    follower:followers.length,
                }
            )
            .catch((err)=>{
                console.log(err);
            });
        },
        async messageBtn(){
            this.MbtnLoadFlag = true;
            if(this.msgFlag){
                this.$router.push("/messageroom");
            }else{
                const roomId = new Date().getTime().toString();
                const docRef = doc(db, "messageroom", roomId);
                await setDoc(docRef,{
                    roomId:roomId,
                    user1:sessionStorage.getItem("user"),
                    user2:sessionStorage.getItem("otherUser")
                })
                .then(()=>{
                    this.MbtnLoadFlag = false;
                })
                .catch((err)=>{
                    console.log(err);
                });
                this.$router.push("/messageroom");
            }

        }
    },
    async mounted(){
        const docRef = doc(db, "users", this.otherUid);
        const FcollectionRef = collection(db, "users", sessionStorage.getItem("user"), "followes");

        await getDocs(FcollectionRef)
        .then((res)=>{
            if(res.size > 0){  
                res.forEach((data)=>{
                    if(data.id == this.otherUid){
                        this.followFlag = true;
                    }
                });            
            }else{
                this.followFlag = false;
            }
        })
        .catch((err)=>{
            console.log(err)
        });


        const data = await getDoc(docRef);
        this.name = data.data().name;
        this.src = data.data().src;
        this.uid = data.data().uid;
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
                this.msgFlag = true;
            }else{
                this.msgFlag = false;
            }
        })
        .then(()=>{
            this.mountFlag = false;
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
                this.msgFlag = true;
                this.mountFlag = false;
            }else{
                this.msgFlag = false;
            }
        })
        .catch((err)=>{
            console.log(err);
        });
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
.alertWrapper{
  position: relative;
}
.alert{
  position: absolute;
  top:0;
  z-index: 2;
  animation: anim 2s;
}
@keyframes anim {
  0% {
    transform: translateX(-40px);
  }

  50% {
    transform: translateX(0px);
  }

}
</style>
