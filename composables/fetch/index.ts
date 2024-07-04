export const useFetchComposable = () => {
  const toast = useToast()
  const client = useSupabaseClient()

  /**
   * ! Load Data !
   */

  const countData = async (table: string) => {
    const { count } = await client
      .from(table)
      .select('id', { count: 'exact' })

    return { count }
  }

  const insertData = async (insertData: SerializeObject, table: string) => {
    const { error } = await client
      .from(table)
      .insert(insertData)

    if (error) {
      return error
    }
  }

  const updateData = async (table: string, updateData: SerializeObject | never, id: string) => {
    const { error } = await client
      .from(table)
      .update(updateData as never)
      .eq('id', id)

    if (error) {
      toast.add({ title: error.message, color: 'red', timeout: 2000 })
    }
  }

  const upsertData = async (table: string, upsertData: SerializeObject, matOpt: string, matOptVal: string) => {
    if (matOpt) {
      const { error } = await client
        .from(table)
        .upsert(upsertData)
        .eq(matOpt, matOptVal)
        .single()

      if (error) {
        toast.add({ title: error.message, color: 'red', timeout: 2000 })
      }
    }
    else {
      const { error } = await client
        .from(table)
        .upsert(upsertData)
        .single()

      if (error) {
        toast.add({ title: error.message, color: 'red', timeout: 2000 })
      }
    }
  }

  const loadStorage = async (storage: string, imageName: string) => {
    const { data } = await client
      .storage
      .from(storage)
      .getPublicUrl(imageName)

    return data.publicUrl
  }

  const uploadStorage = async (storage: string, path: string, file: File) => {
    const { error } = await client
      .storage
      .from(storage)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true,
      })

    if (error) {
      toast.add({ title: error.message, color: 'red', timeout: 2000 })
    }
  }

  const deleteData = async (table: string, admin: boolean, idOpt: string, deleteId: string, matOpt: string, matOptVal: string, subMatOpt: string, subMatOptVal: string) => {
    if (admin) {
      const { error } = await client
        .from(table)
        .delete()
        .eq(idOpt, deleteId)
        .eq(matOpt, matOptVal)

      if (error) {
        toast.add({ title: error.message, color: 'red', timeout: 2000 })
      }
    }
    else if (matOpt && subMatOpt) {
      const { error } = await client
        .from(table)
        .delete()
        .eq('id', deleteId)
        .eq(matOpt, matOptVal)
        .eq(subMatOpt, subMatOptVal)

      if (error) {
        toast.add({ title: error.message, color: 'red', timeout: 2000 })
      }
    }
    else {
      const { error } = await client
        .from(table)
        .delete()
        .eq('id', deleteId)

      if (error) {
        toast.add({ title: error.message, color: 'red', timeout: 2000 })
      }
    }
  }

  const logout = async () => {
    await client.auth.signOut()
  }

  return {
    countData,
    insertData,
    updateData,
    upsertData,
    loadStorage,
    uploadStorage,
    deleteData,
    logout,
  }
}
