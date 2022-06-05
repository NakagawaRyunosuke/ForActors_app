<template>
  <v-app>
      <v-navigation-drawer
        v-model="drawer"
        app
        color="black"
        v-if="loginFlag"
      >
        <div
          v-for="icon in icons"
          :key="icon.key"
          icon
          @click="formClose"
          class="my-8"
        >
          <div class="d-flex pl-5">
            <v-btn text :to="icon.to">
              <v-icon large color="white">
                {{ icon.name }}
              </v-icon>
              <h2 class="text">{{ icon.text }}</h2>
            </v-btn>
          </div>
        </div>
      </v-navigation-drawer>

      <v-app-bar app color="black" >
        <v-app-bar-nav-icon @click="clickMenu" color="white"></v-app-bar-nav-icon>

        <v-toolbar-title class="title" @click="goHome">ForActors</v-toolbar-title>
        <v-btn
          text
          class="logout"
          v-if="loginFlag"
          @click="logout"
          color="white"
        ><v-icon>mdi-logout</v-icon></v-btn>   
      </v-app-bar>
    

    <v-main>
     <router-view/>
    </v-main>
  </v-app>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data(){
    return{
      icons:[
        {name:"mdi-home",to:"/",key:"1", text:"ホーム"},
        {name:"mdi-magnify",to:"/search",key:"2", text:"検索"},
        {name:"mdi-account",to:"/profile",key:"3", text:"プロフィール"},
        {name:"mdi-email",to:"/message",key:"4", text:"メッセージ"},
      ],
      drawer:null
    }
  },
  methods:{
    clickMenu(){
      if(window.outerWidth < 1440){
        if(sessionStorage.getItem("user") != undefined){
          this.drawer = !this.drawer;
        }
      }else{
        this.drawer = true;
      }

    },
    logout(){
      sessionStorage.removeItem("user");
      this.$router.push("/login")
      this.$router.go({path: this.$router.currentRoute.path, force: true});
    },
    formClose(){
      this.$store.state.postFlag = false;
    },
    goHome(){
      if(this.$route.path != "/"){
        this.$router.push("/");
      }
      
    }
  },
  computed:{
    loginFlag(){
      const uid = sessionStorage.getItem("user");
      if(uid){
        return true;
      }
      return false;
    }
  },
})
</script>

<style scoped>
.logout{
  margin-left: auto;
}
.title{
  color: white;
  margin-right: auto;
}
.text{
  color: white;
}
</style>
<style>
body{
  position: relative;
}
</style>