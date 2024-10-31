import {
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Entity('report')
export class Report {
  @PrimaryGeneratedColumn('uuid', { name: 'REPORT_ID' })
  id: string;

  @Column({ type: 'varchar', length: 36, name: 'REPORTED_ENTITY_ID' })
  reportedEntityId: string;

  @Column({
    type: 'enum',
    enum: ['Post', 'Comment', 'User'],
    name: 'REPORT_TYPE',
  })
  reportType: 'Post' | 'Comment' | 'User';

  @Column({ type: 'varchar', length: 255, name: 'REPORT_REASON' })
  reportReason: string;

  @Column({
    type: 'enum',
    enum: ['Pending', 'Under Review', 'Resolved', 'Rejected'],
    name: 'REPORT_STATUS',
    default: 'Pending',
  })
  reportStatus: 'Pending' | 'Under Review' | 'Resolved' | 'Rejected';

  @ManyToOne(() => User, { eager: true })
  @JoinColumn({ name: 'REPORTER_ID' })
  reporter: User;

  @CreateDateColumn({ name: 'CREATED_AT' })
  createAt: Date;

  @UpdateDateColumn({ name: 'UPDATED_AT' })
  updateAt: Date;
}
