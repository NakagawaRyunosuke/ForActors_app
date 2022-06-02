<template>
    <div>
        <Backbtn :path="'/message'"/>
        <div>
            <v-card
                v-for="(item,index) in items"
                :key="`text-${index}`"
                class="mx-4 mt-4"
                elevation=1
            >
                <v-row> 
                    <v-col cols=2>
                        <picture>
                            <source :srcset="item.src">
                            <img src="../assets/default.png" alt="default" class="img">
                        </picture>
                    </v-col>
                    <v-col cols=10>
                        <p class="text">{{item.text}}</p>
                    </v-col>
                </v-row>  
                <p class="date">{{item.date}}</p> 
            </v-card>

        </div>

        <div class="d-flex input mx-5">
            <v-textarea rows=1 auto-grow clearable v-model="test"></v-textarea>
            <v-btn class="sendBtn" @click="send" text><v-icon class="ml-2">mdi-send</v-icon></v-btn>
        </div>
    </div>
</template>

<script>
import Backbtn from "../components/Backbtn.vue";

export default {
    components:{
        Backbtn,
    },
    data(){
        return{
            items:[
                {src:"",text:"ああああああああああああああああああああああああああ",date:"2022/06/01"},
                {src:"",text:"何言ってるの？笑",date:"2022/06/01"}
            ],
            test:""
        }
    },
    methods:{
        send(){
            this.items[0].text = this.test;
            console.log(this.test)
        }
    }
}
</script>

<style scoped>
.input{
    position: absolute;
    bottom: 0;
    width: 90%;
}
.img{
    margin-left: 20px;
    width: 30px;
    height: 30px;
    border-radius: 100%;
    border: 2px solid rgba(146, 142, 142, 0.729);
    background-color: rgba(128, 128, 128, 0.514);
}
.date{
    font-size: 10px;
    text-align: right;
}
.text{
    white-space: pre-line;
}

</style>