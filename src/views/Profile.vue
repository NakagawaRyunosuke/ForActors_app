<template>
    <v-container>
        <v-row no-gutters>
            <v-col>
                <v-card
                    class="pa-2 transparent"
                    outlined
                    tile
                >
                    <div>
                        <h2 class="ml-6">{{name}}</h2>
                        <picture>
                            <source :srcset="src">
                            <img src="../assets/default.png" alt="default">
                        </picture>
                    </div>
                </v-card>
            </v-col>
            <v-col>
                <v-card
                    class="pa-2 transparent"
                    outlined
                    tile
                >
                    <div>
                        <v-icon>mdi-logout</v-icon>
                    </div>
                    <div class="d-flex">
                        <p>フォロー</p>
                        <p>|</p>
                        <p>フォロワー</p>
                    </div>
                </v-card>
            </v-col>

        </v-row>

    </v-container>
</template>

<script>
export default {
    data(){
        return{
            src:require("../assets/test.png"),
            name:"test太郎"
        }
    }
}
</script>

<style scoped>
.container{
    height: 100%;
    width: 100%;
    margin-top: 2px;
    background-color: rgba(216, 245, 216, 0.753);
}
img{
    width: 150px;
    height: 150px;
    border-radius: 100%;
}

</style>