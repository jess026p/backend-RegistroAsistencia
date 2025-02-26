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
import { EmployeeEntity } from './employee.entity';

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
  @ManyToOne(() => EmployeeEntity)
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @Column({
    type: 'uuid',
    name: 'employee_id',
    comment: 'Relación con EmployeeEntity',
  })
  employeeId: string;

  @ManyToOne(() => CatalogueEntity, {nullable: true})
  @JoinColumn({ name: 'type_id' })
  type: CatalogueEntity;

  @Column({
    type: 'uuid',
    name: 'type_id',
    nullable:true,
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