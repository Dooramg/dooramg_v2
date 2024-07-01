export default defineEventHandler(async (event) => {
  const queryString = getQuery(event)

  const data: any = await $fetch((String(queryString.query)), {
    'baseURL': 'https://apis.openapi.sk.com/tmap',
    'headers': {
      appKey: useRuntimeConfig().public.skOpenApiKey,
    },
    'Content-Type': 'application/json',
    'method': 'GET',
    'parseResponse': JSON.parse,
  })
  return data
})
