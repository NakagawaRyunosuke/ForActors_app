<template>
    <v-container>
        <v-icon large @click="back" class="mb-10">mdi-arrow-left</v-icon>
        <div class="contents">
            <v-card v-for="follower in followerItems" :key="follower.name">
                <v-row> 
                    <v-col cols=4 class="mt-1">
                        <picture>
                            <source :srcset="follower.src">
                            <img src="../assets/default.png" alt="default" class="img">
                        </picture>
                    </v-col>
                    <v-col cols=8 class="my-auto">
                        <h2>{{ follower.name }}</h2>
                    </v-col>
                </v-row>   
            </v-card>
        </div>

    </v-container>
</template>

<script>
export default {
    props:{
        followerItems:Array,
    },
    methods:{
        back(){
            this.$emit("back", false);
        }
    }
}
</script>

<style scoped>
.img{
    margin-left: 20px;
    width: 60px;
    height: 60px;
    border-radius: 100%;
    border: 2px solid rgba(146, 142, 142, 0.729);
    background-color: rgba(128, 128, 128, 0.514);
}
.contents{
    overflow-y: auto;
    overflow-x: hidden;
}
</style>