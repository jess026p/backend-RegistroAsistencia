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

@Entity('schedules', { schema: 'core' })
export class ScheduleEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  /** Campos de creación, actualización y eliminación **/
  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creación del horario',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de última actualización del horario',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de eliminación del horario',
  })
  deletedAt: Date;

  /** Foreign Keys **/
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'uuid',
    name: 'user_id',
    comment: 'Relación con UserEntity',
  })
  userId: string;

  /** Columns **/
  @Column({
    name: 'day_of_week',
    type: 'varchar',
    comment: 'Día de la semana en el que aplica el horario (Lunes, Martes, etc.)',
  })
  dayOfWeek: string;

  @Column({
    name: 'start_time',
    type: 'time',
    comment: 'Hora de inicio del turno o jornada',
  })
  startTime: string;

  @Column({
    name: 'end_time',
    type: 'time',
    comment: 'Hora de finalización del turno o jornada',
  })
  endTime: string;
}
