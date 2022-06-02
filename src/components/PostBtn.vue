<template>       
    <div class="postBtn">
        <v-btn class="rounded-circle" width=80 height=80 color="black" @click="clickPostBtn">
            <v-icon large color="white">mdi-note-plus-outline</v-icon>
        </v-btn>
    </div>
</template>

<script>
export default {
    methods:{
        clickPostBtn(){
            if(!this.$store.state.postFlag){
                this.$store.state.postFlag = true;
            }
        }
    }
}
</script>

<style scoped>
.postBtn{
    position:absolute;
    right: 10px;
    bottom: 20px;
}
</style>