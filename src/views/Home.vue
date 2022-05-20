<template>
  <v-container>
    <div>
      <h3 class="text">みんなのオーディション情報</h3>
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
        </div>

        <v-card-title class="py-0 px-4"><a :href="item.url" target="_blank" rel="noopener noreferrer">{{ item.title }}</a></v-card-title>
        <v-card-text>{{ item.text }}</v-card-text>
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
import { collection, getDocs } from "firebase/firestore";

export default {
  components:{
    PostBtn,
    PostForm
  },
  async mounted(){
    const user =sessionStorage.getItem('user');
    if(!user){
      this.$router.push("/login");
    }

    const collectionRef = collection(db, "audition");
    const datas = await getDocs(collectionRef);
    datas.forEach((data)=>{
      this.items.push(data.data());
    });
  },
  data(){
    return{
      items:[],
      color:""
    }
  },
  methods:{
    clickStar(){
      if(this.color === "yellow"){
        this.color = "";
      }else{
        this.color = "yellow";
      }
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
  overflow: auto;
}
.text{
  border-bottom: 1px solid black;
}
.title{
  width: 50%;
}
</style>


