export default defineEventHandler(async (event) => {
  const queryString = getQuery(event)

  const data: any = await $fetch((String(queryString.query)), {
    'baseURL': 'http://www.opinet.co.kr/api',
    'Content-Type': 'application/json',
    'method': 'GET',
    'parseResponse': JSON.parse,
  })
  return data
})
