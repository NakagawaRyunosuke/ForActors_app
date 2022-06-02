<template>
    <v-card elevatin="5" outline color="grey lighten-2"> 
        <v-card-title>{{ text }}</v-card-title>
    </v-card>
</template>

<script>
export default {
    props:{
        text:{
            type:String
        }
    }
}
</script>