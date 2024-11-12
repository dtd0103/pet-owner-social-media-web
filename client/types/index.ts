export type User = {
  id: string
  name: string
  avatar?: string | null
  email?: string
  tel?: string
  password?: string
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
  entity_id: string
  type: 'Post' | 'Comment' | 'User'
  reason: string
  status: 'Pending' | 'Under Review' | 'Resolved' | 'Rejected'
  created_at: string
  updated_at: string
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
