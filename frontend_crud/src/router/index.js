import { createRouter, createWebHistory } from "vue-router";
import Home from "../views/HomePage.vue";
import Create from "../views/CreateUser.vue";
import Edit from "../views/EditUser.vue";

 
const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/create", name: "Create", component: Create },
  { path: "/edit/:id", name: "Edit", component: Edit },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
