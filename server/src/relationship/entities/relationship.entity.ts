import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
@Entity('relationship')
export class Relationship {
  @PrimaryGeneratedColumn('uuid', { name: 'REL_ID' })
  id: string;

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted'],
    name: 'STATUS',
  })
  status: 'pending' | 'accepted';

  @Column({ type: 'tinyint', name: 'IS_FRIEND' })
  isFriend: boolean;

  @Column({ type: 'tinyint', name: 'IS_BLOCKED' })
  isBlocked: boolean;

  @ManyToOne(() => User, (user) => user.relationships)
  @JoinColumn({ name: 'USER_ID' })
  user: User;

  @ManyToOne(() => User, (user) => user.friendships)
  @JoinColumn({ name: 'FRIEND_ID' })
  friend: User;

  @Column({
    type: 'datetime',
    name: 'DATE',
    nullable: true,
    default: null,
  })
  date: Date | null;
}
