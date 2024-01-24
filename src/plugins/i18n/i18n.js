import { createI18n } from "vue-i18n"
import messages from "./message"

const i18n = createI18n({
  locale: 'en',
  missingWarn: false, 
  fallbackWarn: false,
  silentTranslationWarn: true,
  allowComposition: true, // you need to specify that!
  messages,
})

export default i18n
