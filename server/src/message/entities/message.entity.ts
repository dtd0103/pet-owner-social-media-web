import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Media } from 'src/media/entities/media.entity';
import { Group } from 'src/group/entities/group.entity';
@Entity('message')
export class Message {
  @PrimaryGeneratedColumn('uuid', { name: 'MESSAGE_ID' })
  id: string;

  @Column({ type: 'varchar', length: 255, name: 'MESSAGE_CONTENT' })
  content: string;

  @OneToOne(() => Media, (media) => media.message, { cascade: true })
  media: Media;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'SENDER_ID' })
  sender: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'RECEIVER_ID' })
  receiver: User;

  @ManyToOne(() => Group)
  @JoinColumn({ name: 'GROUP_ID' })
  group: Group;

  @CreateDateColumn({ name: 'SENT_AT' })
  sendAt: Date;
}
