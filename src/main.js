import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Graph3dPlugin from './plugins/graph3d-plugin'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(Graph3dPlugin, { store: store })

app.mount('#app')
