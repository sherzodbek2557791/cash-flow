import Vue from 'vue'
import VueI18n from 'vue-i18n'
import uz_CYR from './uz-CYR'

Vue.use(VueI18n)

export default new VueI18n({
    locale: 'uz-CYR',
    fallbackLocale: 'uz-CYR',
    messages: {
        "uz-CYR": uz_CYR
    }
})