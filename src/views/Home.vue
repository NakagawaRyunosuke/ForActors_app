<template>
  <v-container>
    <div>
      <h3>みんなのオーディション情報</h3>
    </div>
    <div class="auditionBoad">
      <v-card
        elevatuon="2"
        v-for="item in items"
        :key="item.id"
        class="mb-2"
      >
        <v-card-title><a :herf="item.url">{{ item.title }}</a></v-card-title>
        <v-card-subtitle>ひとことコメント：</v-card-subtitle>
        <v-card-text>{{ item.text }}</v-card-text>
      </v-card>
    </div>

    <PostBtn/>
  </v-container>
</template>

<script>
import PostBtn from "../components/PostBtn.vue";

export default {
  components:{
    PostBtn,
  },
  mounted(){
    const user =sessionStorage.getItem('user');
    if(!user){
      this.$router.push("/login");
    }
  },
  data(){
    return{
      items:[
        {id:1,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
        {id:2,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
        {id:3,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
        {id:4,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
        {id:5,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
        {id:6,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
        {id:7,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
        {id:8,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
        {id:9,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
        {id:10,title:"title",url:"https://google.com",text:"やる気のあるやつ、大募集！"},
      ]
    }
  }
}
</script>

<style scoped>
.container{
    height: 100%;
    width: 100%;
    margin-top: 2px;
    background-color: rgba(252, 184, 184, 0.753);
}
.auditionBoad{
  height: 665px;
  overflow: auto;
}
</style>


