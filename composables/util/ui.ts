import nameLists from '~/data/tempNames'

export const useUi = () => {
  const genUid = () => {
    return (new Date().getTime() + Math.random().toString(36).substring(2, 16))
  }
  const comma = (value: number) => {
    return String(value).replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,')
  }

  const uncommaRegex = /(\d)(?=(?:\d{3})+(?!\d))/g
  const commaRegex = /[^\d]+/g
  const numberRegex = /^[0-9]+$/
  const hyperLinkRegex = /(mailto:[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)|(((?:https?)|(?:ftp)):\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm
  const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/g
  const emailRegex = /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/
  const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/

  const digitsRoundUp = (value: number, method: string, digits: number) => {
    let result = 0
    switch (method) {
      case 'round' :
        result = Math.round(value * digits) / digits
        break
      case 'ceil' :
        result = Math.ceil(value * digits) / digits
        break
      case 'floor' :
        result = Math.floor(value * digits) / digits
        break
    }
    return result
  }

  const checkHyperLink = (link: string) => {
    const regLink = /(mailto:[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)|(((?:https?)|(?:ftp)):\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gm
    let returnValue = false

    !regLink.test(link)
      ? returnValue = false
      : returnValue = true
    return returnValue
  }

  const checkYoutubeLink = (link: string) => {
    const regLink = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|playlist\?|watch\?v=|watch\?.+(?:&|&#38;);v=))([a-zA-Z0-9\-_]{11})?(?:(?:\?|&|&#38;)index=((?:\d){1,3}))?(?:(?:\?|&|&#38;)?list=([a-zA-Z\-_0-9]{34}))?(?:\S+)?/g
    let returnValue = false

    !regLink.test(link)
      ? returnValue = false
      : returnValue = true
    return returnValue
  }

  const checkNumber = (value: string) => {
    return numberRegex.test(value)
  }

  const checkEmail = (email: string) => {
    const regEmail = /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/
    let returnValue = false

    !regEmail.test(email)
      ? returnValue = false
      : returnValue = true
    return returnValue
  }

  const generateTempName = () => {
    const frontName = nameLists.tempNames.frontName
    const backName = nameLists.tempNames.backName

    const randomFront = frontName[Math.floor(Math.random() * frontName.length)]
    const randomBack = backName[Math.floor(Math.random() * backName.length)]

    return randomFront.concat(' ', randomBack)
  }

  const diffDate = (created: string, current: string) => {
    const oldDate = new Date(created)
    const newDate = new Date(current)
    const diff = Math.ceil(Math.abs(newDate.getTime() - oldDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    return diff
  }

  const nextMonth = (date: string) => {
    return new Date(new Date(date).setMonth(new Date(date).getMonth() + 1))
  }

  const getTimeZone = (date: string) => {
    return date.concat('T00:00:00.000Z')
  }

  return {
    genUid,
    comma,
    uncommaRegex,
    commaRegex,
    numberRegex,
    hyperLinkRegex,
    youtubeRegex,
    emailRegex,
    passwordRegex,
    digitsRoundUp,
    checkHyperLink,
    checkYoutubeLink,
    checkNumber,
    checkEmail,
    generateTempName,
    diffDate,
    nextMonth,
    getTimeZone,
  }
}
