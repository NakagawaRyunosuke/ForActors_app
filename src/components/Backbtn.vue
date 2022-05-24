<template>
    <v-icon large @click="back">mdi-arrow-left</v-icon>
</template>

<script>
export default {
    methods:{
        back(){
            this.$router.push("/search");
        }
    }
}
</script>