import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Media } from 'src/media/entities/media.entity';

@Entity('comment')
export class Comment {
  @PrimaryGeneratedColumn('uuid', { name: 'COMMENT_ID' })
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'COMMENT_TEXT' })
  text: string;

  @CreateDateColumn({ type: 'datetime', name: 'CREATED_AT' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'datetime', name: 'UPDATED_AT' })
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'USER_ID' })
  user: User;

  @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'POST_ID' })
  post: Post;

  @OneToOne(() => Media, (media) => media.comment, {
    nullable: true,
  })
  media: Media;

  @ManyToOne(() => Comment, (comment) => comment.replies, { nullable: true })
  @JoinColumn({ name: 'COMMENT_REPLIED_ID' })
  repliedComment: Comment;

  @OneToMany(() => Comment, (comment) => comment.repliedComment)
  replies: Comment[];
}
