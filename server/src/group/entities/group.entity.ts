import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Entity('group')
export class Group {
  @PrimaryGeneratedColumn('uuid', { name: 'GROUP_ID' })
  id: string;

  @Column({ name: 'GROUP_NAME', type: 'varchar', length: 50 })
  name: string;

  @Column({ name: 'GROUP_AVATAR', type: 'varchar', length: 50, nullable: true })
  avatar: string;

  @ManyToMany(() => User, (user) => user.groups)
  @JoinTable({
    name: 'user_group',
    joinColumn: {
      name: 'GROUP_ID',
    },
    inverseJoinColumn: {
      name: 'USER_ID',
    },
  })
  users: User[];

  @OneToMany(() => Post, (post) => post.group)
  posts?: Post[];
}
