<template>
  <v-app>
    <v-card
      flat
      tile
    >
      <v-app-bar
        elevation="6"
        flat
        hide-on-scroll
      >
        <h3>~ For actors ~</h3>
      </v-app-bar>
    </v-card>

    <v-main>
     <router-view/>
    </v-main>
    
    <v-footer
      padless
    >
      <v-card
        flat
        tile
        width="100%"
        class="text-center"
        elevation="20"
      >
        <v-card-text>
          <v-btn
            v-for="icon in icons"
            :key="icon"
            class="mx-10"
            icon
          >
            <v-icon size="35px">
              {{ icon }}
            </v-icon>
          </v-btn>
        </v-card-text>
      </v-card>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data(){
    return{
      icons:[
        "mdi-home",
        "mdi-magnify",
        "mdi-account",
        "mdi-email",
      ],
    }
  }
})
</script>
