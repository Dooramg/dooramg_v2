export default defineNuxtRouteMiddleware((_to, _from) => {
  const user = useSupabaseUser()

  if (user.value?.id) {
    return navigateTo('/main')
  }
})
