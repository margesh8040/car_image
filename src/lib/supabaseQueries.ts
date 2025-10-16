import { supabase } from './supabase'

export const signUp = async (email: string, password: string, username: string) => {
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('username')
    .eq('username', username)
    .maybeSingle()

  if (existingUser) {
    throw new Error('Username already exists')
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
      },
    },
  })

  if (error) throw error
  return data
}

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export const getSession = async () => {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data
}

export const getAllImages = async () => {
  const { data, error } = await supabase
    .from('images')
    .select(`
      *,
      profiles:user_id (
        username
      )
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const getUserImages = async (userId: string) => {
  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export const uploadImage = async (
  userId: string,
  file: File,
  metadata: {
    image_name: string
    description?: string
    category: string
    hashtags?: string[]
  }
) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  const { data: storageData, error: storageError } = await supabase.storage
    .from('car-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (storageError) throw storageError

  const { data: { publicUrl } } = supabase.storage
    .from('car-images')
    .getPublicUrl(fileName)

  const { data, error } = await supabase
    .from('images')
    .insert({
      user_id: userId,
      storage_url: publicUrl,
      ...metadata,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteImage = async (imageId: string, storageUrl: string) => {
  const urlParts = storageUrl.split('/car-images/')
  const filePath = urlParts[1]

  const { error: storageError } = await supabase.storage
    .from('car-images')
    .remove([filePath])

  if (storageError) throw storageError

  const { error } = await supabase
    .from('images')
    .delete()
    .eq('id', imageId)

  if (error) throw error
}

export const incrementDownloadCount = async (imageId: string) => {
  const { error } = await supabase.rpc('increment_download_count', {
    image_id: imageId,
  })

  if (error) throw error
}

export const toggleLike = async (userId: string, imageId: string) => {
  const { data: existingLike } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('image_id', imageId)
    .maybeSingle()

  if (existingLike) {
    const { error } = await supabase
      .from('likes')
      .delete()
      .eq('user_id', userId)
      .eq('image_id', imageId)

    if (error) throw error
    return false
  } else {
    const { error } = await supabase
      .from('likes')
      .insert({
        user_id: userId,
        image_id: imageId,
      })

    if (error) throw error
    return true
  }
}

export const checkIfLiked = async (userId: string, imageId: string) => {
  const { data } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('image_id', imageId)
    .maybeSingle()

  return !!data
}

export const getUserLikes = async (userId: string) => {
  const { data, error } = await supabase
    .from('likes')
    .select('image_id')
    .eq('user_id', userId)

  if (error) throw error
  return data.map(like => like.image_id)
}

export const searchImages = async (query: string, category?: string) => {
  let queryBuilder = supabase
    .from('images')
    .select(`
      *,
      profiles:user_id (
        username
      )
    `)

  if (query) {
    queryBuilder = queryBuilder.or(`image_name.ilike.%${query}%,description.ilike.%${query}%`)
  }

  if (category && category !== 'all') {
    queryBuilder = queryBuilder.eq('category', category)
  }

  queryBuilder = queryBuilder.order('created_at', { ascending: false })

  const { data, error } = await queryBuilder

  if (error) throw error
  return data
}
