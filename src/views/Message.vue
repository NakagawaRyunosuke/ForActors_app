<template>
    <div class="list">
        <h2>これはテストページです。現在開発中のためもうしばらくお待ちください</h2>
        <v-card
            class="mt-4"
        >
            <v-row> 
                <v-col cols=4>
                    <picture>
                        <!-- <source :srcset="src"> -->
                        <img src="../assets/default.png" alt="default" class="img">
                    </picture>
                </v-col>

                <v-col cols=8>
                    <div class="d-flex">
                        <h3>test太郎</h3>
                        <v-spacer></v-spacer>
                        <p class="my-auto mr-2">{{ new Date().getFullYear()+"/"+(new Date().getMonth()+1)+"/"+new Date().getDate() }}</p>
                    </div>
                    
                    <hr>
                    <p class="mt-2">今日暇？</p>
                </v-col>
            </v-row>
        </v-card>
    </div>

</template>

<style scoped>
.img{
    margin-left: 20px;
    width: 80px;
    height: 80px;
    border-radius: 100%;
    border: 2px solid rgba(146, 142, 142, 0.729);
    background-color: rgba(128, 128, 128, 0.514);
}
.list{
    overflow-y: auto;
    overflow-x: hidden;
}
</style>