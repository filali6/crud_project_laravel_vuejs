import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import HomeUser from "../views/HomeUser.vue";
import Create from "../views/CreateUser.vue";
import Edit from "../views/EditUser.vue";
 
import RegisterPage from "../views/RegisterPage.vue";
import LoginPage from "../views/LoginPage.vue";
import ChatPage from "../views/ChatPage.vue";

 
const routes = [
  { path: "/", redirect: "/login" },
  {
    path: "/home",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/user",
    name: "HomeUser",
    component: HomeUser,
    meta: { requiresAuth: true },
  },
  {
    path: "/create",
    name: "Create",
    component: Create,
    meta: { requiresAuth: true },
  },
  {
    path: "/edit/:id",
    name: "Edit",
    component: Edit,
    meta: { requiresAuth: true },
  },
  {
    path: "/register",
    name: "Register",
    component: RegisterPage,
    meta: { requiresGuest: true },
  },
  {
    path: "/login",
    name: "Login",
    component: LoginPage,
    meta: { requiresGuest: true },
  },
  {
    path: "/chat/:userId",
    name: "Chat",
    component: ChatPage,
    props: true,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
router.beforeEach((to,from , next) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  
  if (to.meta.requiresAuth && !token) {
    next("/login");
  }
   
  else if (to.meta.requiresGuest && token) {
     
    if (user.role === "admin") {
      next("/home");
    } else {
      next("/user");
    }
  }
  
  else {
    next();
  }
});

export default router;
