<template>
  <v-container>
    <div class="d-flex text">
      <h3 class="mr-16">みんなのオーディション情報</h3>
      <v-icon @click="refresh">mdi-refresh</v-icon>
    </div>
    <div class="auditionBoad">
      <v-card
        elevatuon="2"
        v-for="item in items"
        :key="item.id"
        class="mb-2"
      >
        <div class="d-flex" height=40>
          <v-card-subtitle class="my-auto title">{{ item.date }}</v-card-subtitle>
          <v-row justify="center">
            <v-btn
                class="mt-4 rounded-b-xl"
                height=60
                tile
                elevation="0"
                :color="item.color"
                @click="clickStar(item.id)"
            ><v-icon large>mdi-star-outline</v-icon></v-btn>
          </v-row>
        </div>

        <v-card-title class="py-0 px-4"><a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></v-card-title>
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
import db from "../plugins/firebase";
import { collection, getDocs, orderBy, query, where, updateDoc, doc } from "firebase/firestore";

export default {
  components:{
    PostBtn,
    PostForm
  },
  async created(){
    const user =sessionStorage.getItem('user');
    if(!user){
      this.$router.push("/login");
    }

    const collectionRef = collection(db, "audition");
    const q = query(collectionRef, orderBy("id", "desc"));
    const datas = await getDocs(q);
    datas.forEach((data)=>{
      this.items.push(data.data());
    });
  },
  data(){
    return{
      items:[],
      clickData:null,
      clickDataId:"",

    }
  },
  methods:{
    async clickStar(id){
      this.loadFlag = true;
      const collectionRef = collection(db, "audition");
      const q = query(collectionRef, where("id", "==", id));
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

      if(this.clickData.color == "yellow"){
        const docRef = doc(db, "audition", this.clickDataId);
        await updateDoc(docRef,{
          color:""
        });
        this.refresh();
      }else{
        const docRef = doc(db, "audition", this.clickDataId);
        await updateDoc(docRef,{
          color:"yellow"
        });
        this.refresh();
      }

    },
    async refresh(){
      this.items = [];
      const collectionRef = collection(db, "audition");
      const q = query(collectionRef, orderBy("id", "desc"));
      const datas = await getDocs(q);
      datas.forEach((data)=>{
        this.items.push(data.data());
      });
    }
  }
}
</script>

<style scoped>
.container{
    height: 100%;
    width: 100%;
    margin-top: 2px;
}
.auditionBoad{
  height: 665px;
  overflow-y: auto;
  overflow-x: hidden;
}
.text{
  border-bottom: 1px solid black;
}
.title{
  width: 50%;
}
</style>


