import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Comment } from 'src/comment/entities/comment.entity';
import { Message } from 'src/message/entities/message.entity';
import { Post } from 'src/post/entities/post.entity';

@Entity('media')
export class Media {
  @PrimaryGeneratedColumn('uuid', { name: 'MEDIA_ID' })
  id: string;

  @Column({ length: 50, name: 'MEDIA_LINK' })
  link: string;

  @Column({
    type: 'enum',
    enum: ['image', 'video'],
    name: 'MEDIA_TYPE',
  })
  type: 'image' | 'video';

  @OneToOne(() => Post, (post) => post.media, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'POST_ID' })
  post: Post;

  @OneToOne(() => Comment, (comment) => comment.media, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'COMMENT_ID' })
  comment: Comment;

  @OneToOne(() => Message, (message) => message.media, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'MESSAGE_ID' })
  message: Message;
}