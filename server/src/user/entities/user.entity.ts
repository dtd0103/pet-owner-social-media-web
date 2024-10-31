import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Relationship } from 'src/relationship/entities/relationship.entity';
import { Group } from 'src/group/entities/group.entity';
import { Message } from 'src/message/entities/message.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { Report } from 'src/report/entities/report.entity';
import { Notification } from 'src/notification/notification.entity';
@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'USER_ID' })
  id: string;

  @Column({ length: 50, name: 'USER_NAME' })
  name: string;

  @Column({ length: 50, unique: true, name: 'USER_EMAIL' })
  email: string;

  @Column({ unique: true, name: 'USER_TEL' })
  tel: string;

  @Column({ length: 255, name: 'USER_PASSWORD' })
  password: string;

  @Column({ type: 'enum', enum: ['Pet Owner', 'Admin'], name: 'USER_ROLE' })
  role: 'Pet Owner' | 'Admin';

  @Column({ length: 50, nullable: true, name: 'USER_AVATAR' })
  avatar: string;

  @Column({ length: 50, nullable: true, name: 'USER_BACKGROUND' })
  background: string;

  @Column({ type: 'tinyint', default: 1, name: 'USER_STATUS' })
  status: number;

  @CreateDateColumn({ type: 'datetime', name: 'CREATE_AT' })
  createAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'UPDATE_AT' })
  updateAt: Date;

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Relationship, (relationship) => relationship.user)
  relationships: Relationship[];

  @OneToMany(() => Relationship, (relationship) => relationship.friend)
  friendships: Relationship[];

  @OneToMany(() => Message, (message) => message.sender)
  sentMessages: Message[];

  @OneToMany(() => Message, (message) => message.receiver)
  receivedMessages: Message[];

  @OneToMany(() => Activity, (activity) => activity.user)
  activities: Activity[];

  @OneToMany(() => Report, (report) => report.reporter)
  reports: Report[];

  @OneToMany(() => Notification, (notification) => notification.user)
  notifications: Notification[];

  @ManyToMany(() => Post, (post) => post.likes)
  likedPosts: Post[];

  @ManyToMany(() => Group, (group) => group.users)
  groups: Group[];
}
