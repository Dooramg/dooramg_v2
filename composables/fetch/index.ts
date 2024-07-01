export const useFetchComposable = () => {
  const client = useSupabaseClient()

  /**
   * ! Load Data !
   */

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
      return error
    }
  }

  const upsertData = async (upsertData: SerializeObject, table: string) => {
    const { error } = await client
      .from(table)
      .upsert(upsertData)

    if (error) {
      return error
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

    return error
  }

  const deleteData = async (deleteId: string, table: string, admin: boolean, matOpt: string, matOptVal: string, subMatOpt: string, subMatOptVal: string) => {
    if (admin) {
      const { error } = await client
        .from(table)
        .delete()
        .eq('id', deleteId)
        .eq(matOpt, matOptVal)

      if (error) {
        return error
      }
    }
    else if (subMatOpt && subMatOptVal) {
      const { error } = await client
        .from(table)
        .delete()
        .eq('id', deleteId)
        .eq(matOpt, matOptVal)
        .eq(subMatOpt, subMatOptVal)

      if (error) {
        return error
      }
    }
    else {
      const { error } = await client
        .from(table)
        .delete()
        .eq('id', deleteId)
        .eq(matOpt, matOptVal)

      if (error) {
        return error
      }
    }
  }

  const logout = async () => {
    await client.auth.signOut()
  }

  return {
    insertData,
    updateData,
    upsertData,
    loadStorage,
    uploadStorage,
    deleteData,
    logout,
  }
}
