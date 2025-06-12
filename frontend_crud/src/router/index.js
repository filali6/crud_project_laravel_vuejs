import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import HomeUser from "../views/HomeUser.vue";
import Create from "../views/CreateUser.vue";
import Edit from "../views/EditUser.vue";
 
import RegisterPage from "../views/RegisterPage.vue";
import LoginPage from "../views/LoginPage.vue";

 
const routes = [
  { path: "/", redirect: "/login" },
  { path: "/home", name: "Home", component: Home },
  { path: "/user", name: "HomeUser", component: HomeUser },
  { path: "/create", name: "Create", component: Create },
  { path: "/edit/:id", name: "Edit", component: Edit },
  { path: "/register", name: "Register", component: RegisterPage },
  { path: "/login", name: "Login", component: LoginPage },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
