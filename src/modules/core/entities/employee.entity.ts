import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '@auth/entities';
import { CatalogueEntity } from '@common/entities';
import { ScheduleEntity } from './schedule.entity';

@Entity('employees', { schema: 'core' })
export class EmployeeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
  })
  deletedAt: Date;

  /** Foreign Keys **/

    // Relación con UserEntity (usuario relacionado con el empleado)
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'uuid',
    name: 'user_id',
    comment: 'Relación con UserEntity (usuario asociado al empleado)',
  })
  userId: string;

  // Relación con CatalogueEntity
  @ManyToOne(() => CatalogueEntity)
  @JoinColumn({ name: 'position_id' })
  position: CatalogueEntity;

  @Column({
    type: 'uuid',
    name: 'position_id',
    comment: 'Relación con CatalogueEntity (cargo del empleado)',
  })
  positionId: string;

  @ManyToOne(() => ScheduleEntity, { nullable: true })
  @JoinColumn({ name: 'schedule_id' })
  schedule: ScheduleEntity;

  @Column({
    type: 'uuid',
    name: 'schedule_id',
    nullable: true,
    comment: 'Relación con CatalogueEntity (cargo del empleado)',
  })
  scheduleId: string;

  @Column({
    type: 'boolean',
    name: 'enabled',
    comment: '',
    default: true,
  })
  enabled: boolean;
}
