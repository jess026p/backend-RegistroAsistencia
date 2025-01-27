import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn
} from 'typeorm';
import { CatalogueEntity } from '@common/entities';
import { EmployedEntity } from './employee.entity';

@Entity('attendances', { schema: 'core' })
export class AttendanceEntity {
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
  @ManyToOne(() => EmployedEntity)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployedEntity;

  @Column({
    type: 'uuid',
    name: 'user_id',
    comment: 'Relación con UserEntity',
  })
  employeeId: string;

  @ManyToOne(() => CatalogueEntity)
  @JoinColumn({ name: 'type_id' })
  type: CatalogueEntity;

  @Column({
    type: 'uuid',
    name: 'type_id',
    comment: 'Tipo de asistencia: entrada, salida a almuerzo, regreso de almuerzo, salida a casa',
  })
  typeId: string;

  /** Columns **/
  @Column({
    name: 'registered_at',
    type: 'timestamp',
    comment: 'Fecha y hora de la asistencia' })
  registeredAt: Date;

  @Column({
    name: 'late',
    type: 'boolean',
    comment: 'Atrasado true, a tiempo false' })
  late: boolean;
}