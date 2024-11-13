export type User = {
  id: string
  name: string
  avatar?: string | null
  email?: string
  tel?: string
  password?: string
  role?: 'Pet Owner' | 'Admin'
  status?: boolean
  createAt?: string
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
  quote?: string
  status: boolean
  createdAt: string
  updatedAt: string
}

export type UserGroup = {
  id: string
  name: string
  avatar: string
  role: string
  joinedAt: string
}

export type Comment = {
  id: string
  text: string
  createdAt: string
  updatedAt: string
  user: User
  post: Post
  media?: Media | null
  replied_comment_id?: string | null
}

export type Group = {
  id: string
  name: string
  avatar?: string | null
  users?: UserGroup[]
}

export type Media = {
  id: string
  link: string
  type: 'image' | 'video'
}

export type Post = {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  user: User
  media?: Media
  likes?: User[]
  comments?: Comment[]
  group?: Group
}

export type Like = {
  user_id: string
  post_id: string
}

export type Pet = {
  id: string
  avatar?: string | null
  name: string
  species: string
  sex: number
  breed: string
  date: string
  description: string
  owner: User
}

export type Report = {
  id: string
  reporter: User
  reportedEntityId: string
  reportType: 'Post' | 'Comment' | 'User'
  reportReason: string
  reportStatus: 'Pending' | 'Under Review' | 'Resolved' | 'Rejected'
  createAt: string
  updateAt: string
}

export type Activity = {
  id: string
  action_type: string
  object_type: 'post' | 'group' | 'like' | 'comment' | 'relationship' | 'report' | 'pet' | 'user' | 'message'
  timestamp: string
  details: string
}

export type Relationship = {
  id: string
  status: string
  isFriend: number
  isBlocked: number
  user: User
  friend: User
  date?: string | null
}

export type Message = {
  id: string
  content: string
  media?: Media
  sender: User
  receiver: User
  group?: Group
  sendAt: string
}
