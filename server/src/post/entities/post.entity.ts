import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToMany,
  JoinColumn,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Media } from 'src/media/entities/media.entity';
import { Group } from 'src/group/entities/group.entity';

@Entity('post')
export class Post {
  @PrimaryGeneratedColumn('uuid', { name: 'POST_ID' })
  id: string;

  @Column({ name: 'TITLE', type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'DESCRIPTION', type: 'text' })
  description: string;

  @CreateDateColumn({ name: 'CREATED_AT', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT', type: 'datetime' })
  updatedAt: Date;

  @OneToOne(() => Media, (media) => media.post, { cascade: true })
  media: Media;

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts)
  @JoinColumn({ name: 'USER_ID' })
  user: User;

  @ManyToOne(() => Group, (group) => group.posts)
  @JoinColumn({ name: 'GROUP_ID' })
  group: Group;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'liked',
    joinColumn: { name: 'POST_ID' },
    inverseJoinColumn: { name: 'USER_ID' },
  })
  likes: User[];
}
