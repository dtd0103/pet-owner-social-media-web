import { User } from 'src/user/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('pet')
export class Pet {
  @PrimaryGeneratedColumn('uuid', { name: 'PET_ID' })
  id: string;

  @Column({ type: 'varchar', name: 'PET_AVATAR', length: 255 })
  avatar: string;

  @Column({ type: 'varchar', name: 'PET_NAME', length: 50 })
  name: string;

  @Column({ type: 'varchar', name: 'PET_SPECIES', length: 50 })
  species: string;

  @Column({ type: 'tinyint', name: 'PET_SEX' })
  sex: boolean;

  @Column({ type: 'varchar', name: 'PET_BREED', length: 50 })
  breed: string;

  @Column({ type: 'date', name: 'PET_DATE' })
  date: Date;

  @Column({ type: 'varchar', name: 'PET_DESC', length: 255 })
  description: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'USER_ID' })
  owner: User;
}
