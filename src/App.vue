<template>
  <v-app>
    <v-card
      flat
      tile
    >
      <v-app-bar
        elevation="6"
        flat
        color="black"
      >
        <h3 class="title">For Actors</h3>
        <v-btn
          text
          class="logout"
          v-if="loginFlag"
          @click="logout"
          color="white"
        >ログアウト<v-icon>mdi-logout</v-icon></v-btn>       
      </v-app-bar>
    </v-card>

    <v-main>
     <router-view/>
    </v-main>
    
    <v-footer
      padless
      class="footer"
    >
      <v-card
        flat
        tile
        width="100%"
        class="text-center"
        elevation="20"
        color="black"
      >
        <v-card-text v-if="loginFlag">
          <v-btn
            v-for="icon in icons"
            :key="icon.key"
            class="mx-5"
            icon
            :to="icon.to"
            @click="formClose"
          >
            <v-icon size="auto" color="white">
              {{ icon.name }}
            </v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data(){
    return{
      icons:[
        {name:"mdi-home",to:"/",key:"1"},
        {name:"mdi-magnify",to:"/search",key:"2"},
        {name:"mdi-account",to:"/profile",key:"3"},
        {name:"mdi-email",to:"/message",key:"4"},
      ],

    }
  },
  methods:{
    logout(){
      sessionStorage.removeItem("user");
      this.$router.push("/login")
      this.$router.go({path: this.$router.currentRoute.path, force: true});
    },
    formClose(){
      this.$store.state.postFlag = false;
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
  }
})
</script>

<style scoped>
.logout{
  margin-left:35%;
}
.title{
  color: white;
}
</style>
<style>
body{
  position: relative;
}
</style>