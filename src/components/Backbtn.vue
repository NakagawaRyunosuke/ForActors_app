<template>
    <v-icon large @click="back">mdi-arrow-left</v-icon>
</template>

<script>
export default {
    props:{
        path:String
    },
    methods:{
        back(){
            this.$router.push(this.path);
        }
    }
}
</script>