import { createApp } from 'vue'
import { createRouter, createWebHistory } from 'vue-router'
import App from './App.vue'
import Splash from './views/Splash.vue'
import Dashboard from './views/Dashboard.vue'
import Inventory from './views/Inventory.vue'
import Orders from './views/Orders.vue'
import Demand from './views/Demand.vue'
import Spending from './views/Spending.vue'
import Reports from './views/Reports.vue'
import Restocking from './views/Restocking.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Root redirects to splash landing page
    { path: '/', redirect: '/splash' },
    { path: '/splash', component: Splash },
    // Main app routes (with sidebar)
    { path: '/dashboard', component: Dashboard },
    { path: '/inventory', component: Inventory },
    { path: '/orders', component: Orders },
    { path: '/demand', component: Demand },
    { path: '/spending', component: Spending },
    { path: '/reports', component: Reports },
    { path: '/restocking', component: Restocking }
  ]
})

const app = createApp(App)
app.use(router)
app.mount('#app')
