import Vue from 'vue'
import VueI18n from 'vue-i18n'
import en from './en.json'; // 存放英文翻譯
import tw from './tw.json'; // 存放繁體中文翻譯
import cn from './cn.json'; // 存放簡體中文翻譯

Vue.use(VueI18n);
const messages = {
    en_US: en,
    zh_TW: tw,
    zh_CN: cn
}
export default new VueI18n({
    locale: 'en_US', // set locale
    fallbackLocale: 'en_US', // default locale
    messages, // set locale messages
})