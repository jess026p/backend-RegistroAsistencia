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
import { UserEntity } from '@auth/entities';
import { CatalogueEntity } from '@common/entities';

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
  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'uuid',
    name: 'user_id',
    comment: 'Relación con UserEntity',
  })
  userId: string;

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
}