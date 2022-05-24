import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from "../views/Login.vue"
import AddAccount from "../views//AddAccount.vue"
import EmailForm from "../views/EmailForm.vue"
import Search from "../views/Search.vue"
import Profile from "../views/Profile.vue"
import Message from "../views/Message.vue"
import othersProfile from "../views/othersProfile"

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/addaccount",
    name: "AddAccount",
    component: AddAccount
  },
  {
    path: "/emailForm",
    name: "EmailForm",
    component: EmailForm
  },
  {
    path: "/search",
    name: "Search",
    component: Search
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile
  },
  {
    path: "/message",
    name: "Message",
    component: Message
  },
  {
    path:"/othersProfile",
    name: "OthersProfile",
    component: othersProfile
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
