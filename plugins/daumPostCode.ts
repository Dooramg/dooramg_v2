import vueDaumPostCode from 'vue-daum-postcode'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(vueDaumPostCode, {
    name: 'PostCode',
  })
})
