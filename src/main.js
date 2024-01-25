import App from '@/App.vue'
import { registerPlugins } from '@core/utils/plugins'
import { createApp } from 'vue'

// Styles
import '@core/scss/template/index.scss'
import { install as VueMonacoEditorPlugin } from '@guolao/vue-monaco-editor'
import '@layouts/styles/index.scss'
import store from './store'
// i18n - change language
import i18n from '@/plugins/i18n/i18n'

// Create vue app
const app = createApp(App)

app.use(store)

app.use(i18n)

app.use(VueMonacoEditorPlugin, {
    paths: {
      // The recommended CDN config
      vs: 'https://cdn.jsdelivr.net/npm/monaco-editor@0.43.0/min/vs'
    },
  })

// Register plugins
registerPlugins(app)

// Mount vue app
app.mount('#app')
