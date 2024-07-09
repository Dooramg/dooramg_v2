export const useLoadCode = () => {
  const { headTextList, middleTextList, tailTextList } = storeToRefs(usePlateStore())

  const loadCodeList = async (code: string) => {
    const { data } = await useFetch('/api/common/codeSearch', {
      headers: useRequestHeaders(['cookie']),
      query: {
        searchText: code,
      },
    })

    filterCode(code, data.value as Code[])
  }

  const filterCode = (code: string, codeList: Code[]) => {
    switch (code) {
      case 'CTM' :
        if (!codeList) {
          loadCodeList('CTM')
          return
        }

        headTextList.value = codeList as Code[]
        break
      case 'CMA' :
        if (!codeList) {
          loadCodeList('CMA')
          return
        }
        tailTextList.value = codeList as Code[]
        break
      default :
        middleTextList.value = codeList as Code[]
    }
  }

  return {
    loadCodeList,
  }
}
