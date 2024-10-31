import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
@Entity('activity')
export class Activity {
  @PrimaryGeneratedColumn('uuid', {
    name: 'ACTIVITY_ID',
  })
  id: string;

  @Column({ type: 'varchar', length: 50, name: 'ACTION_TYPE' })
  actionType: string;

  @Column({ type: 'varchar', length: 36, name: 'OBJECT_ID' })
  objectId: string;

  @Column({
    type: 'enum',
    enum: [
      'post',
      'group',
      'like',
      'comment',
      'relationship',
      'report',
      'pet',
      'user',
      'message',
    ],
    name: 'OBJECT_TYPE',
  })
  objectType:
    | 'post'
    | 'group'
    | 'like'
    | 'comment'
    | 'relationship'
    | 'report'
    | 'pet'
    | 'user'
    | 'message';

  @CreateDateColumn({ type: 'datetime', name: 'TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'text', name: 'DETAILS' })
  details: string;

  @ManyToOne(() => User, (user) => user.activities)
  @JoinColumn({ name: 'USER_ID' })
  user: User;
}
