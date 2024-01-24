import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

// Styles
import '@core/scss/template/index.scss'
import '@layouts/styles/index.scss'
import store from './store'

// i18n - change language
import i18n from '@/plugins/i18n/i18n'

// Create vue app
const app = createApp(App)

app.use(store)

app.use(i18n)

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
