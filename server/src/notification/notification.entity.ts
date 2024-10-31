import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('notification')
export class Notification {
  @PrimaryGeneratedColumn('uuid', { name: 'NOTIFICATION_ID' })
  notificationId: string;

  @Column({ type: 'varchar', length: 255, name: 'TITLE' })
  title: string;

  @Column({ type: 'text', name: 'MESSAGE' })
  message: string;

  @Column({ type: 'tinyint', name: 'IS_READ', default: 0 })
  isRead: boolean;

  @Column({ type: 'datetime', name: 'CREATED_AT' })
  createdAt: Date;

  @ManyToOne(() => User, (user) => user.notifications)
  @JoinColumn({ name: 'USER_ID' })
  user: User;
}
