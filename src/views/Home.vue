<template>
  <v-container>
    <div class="alertWrapper">
      <Alert v-show="alertFlag" class="alert" :text="'お気に入りに登録！'"/>
    </div>
    <div class="d-flex text">
      <h3 class="mr-16">みんなのオーディション情報</h3>
      <v-icon @click="refresh">mdi-refresh</v-icon>
    </div>
    <VueLoading v-show="loadFlag" type="spin" color="#333" :size="{ width: '100px', height: '100px' }"/>
    <div class="auditionBoad">
      <v-card
        elevatuon="2"
        v-for="item in this.$store.state.items"
        :key="item.dataId"
        class="mb-2"
      >
        <div class="d-flex" height=40>
          <v-card-subtitle class="my-auto title">{{ item.date }}</v-card-subtitle>
          <v-row justify="center">
            <v-btn
                class="mt-4 rounded-b-xl"
                height=60
                tile
                elevation="3"
                color="grey lighten-2"
                @click="clickPlus(item.dataId)"
            ><v-icon large>mdi-plus</v-icon></v-btn>
          </v-row>
        </div>

        <v-card-title class="py-4 px-4"><a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></v-card-title>
        <v-textarea class="mx-4" :value="item.text" readonly></v-textarea>
      </v-card>
    </div>
   
    <PostBtn/>
    <PostForm v-show="this.$store.state.postFlag" />
    

  </v-container>
</template>

<script>
import PostBtn from "../components/PostBtn.vue";
import PostForm from "../components/PostForm.vue";
import Alert from "../components/Alert.vue";
import { VueLoading } from 'vue-loading-template';
import db from "../plugins/firebase";
import { collection, getDocs, orderBy, query, where, limit, setDoc, doc } from "firebase/firestore";

export default {
  components:{
    PostBtn,
    PostForm,
    Alert,
    VueLoading
  },
  async created(){
    this.loadFlag = true;
    const user =sessionStorage.getItem('user');
    if(!user){
      this.$router.push("/login");
    }else{
      this.$store.state.items = [];
      const collectionRef = collection(db, "audition");
      const q = query(collectionRef, orderBy("dataId", "desc"), limit(30));
      const datas = await getDocs(q);
      datas.forEach((data)=>{
        this.$store.state.items.push(data.data());
      });
      this.loadFlag = false;
    }
  },
  data(){
    return{
      clickData:null,
      clickDataId:"",
      alertFlag:false,
      loadFlag:false
    }
  },
  methods:{
    async clickPlus(dataId){
      const collectionRef = collection(db, "audition");
      const q = query(collectionRef, where("dataId", "==", dataId));
      await getDocs(q)
      .then((res)=>{
        res.forEach((data)=>{
          this.clickDataId = data.id;
          this.clickData = data.data();
        });
      })
      .catch((err)=>{
        console.log(err)
      });

      
      const docRef = doc(db, "users", sessionStorage.getItem("user"), "star", this.clickDataId);
      await setDoc(docRef,this.clickData)
      .catch((err)=>{
        console.log(err);
      });
      this.alertFlag = true;
      setTimeout(()=>{
        this.alertFlag = false;
      },2000);
    },
    async refresh(){
      this.$store.state.items = [];
      const collectionRef = collection(db, "audition");
      const q = query(collectionRef, orderBy("dataId", "desc"), limit(30));
      const datas = await getDocs(q);
      datas.forEach((data)=>{
        this.$store.state.items.push(data.data());
      });
    },
  },
  
}
</script>

<style scoped>
.container{
    height: 100%;
    width: 100%;
    margin-top: 2px;
    position: relative;
}
.auditionBoad{
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.text{
  border-bottom: 0.5px solid black;
}
.title{
  width: 50%;
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


