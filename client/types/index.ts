export type User = {
  id: string
  name: string
  avatar?: string | null
}

export type UserDetail = {
  id: string
  name: string
  email: string
  tel: string
  password: string
  token?: string | null
  role: 'Pet Owner' | 'Admin'
  avatar?: string | null
  background?: string | null
  status: boolean
  createdAt: string
  updatedAt: string
}

export type UserGroup = {
  groupId: string
  userId: string
}
