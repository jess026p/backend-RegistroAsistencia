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
import { FormEntity, PermissionTypeEntity } from '@core/entities';

@Entity('permissions', { schema: 'core' })
export class PermissionEntity {
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
  @ManyToOne(() => PermissionTypeEntity)
  @JoinColumn({ name: 'permission_type_id' })
  permissionType: PermissionTypeEntity;
  @Column({
    type: 'uuid',
    name: 'permission_type_id',
    comment: 'Tipos de permiso',
  })
  permissionTypeId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
  @Column({
    type: 'uuid',
    name: 'user_id',
    comment: 'relacion',
  })
  userId: string;

  @ManyToOne(() => FormEntity)
  @JoinColumn({ name: 'form_id' })
  form: FormEntity;
  @Column({
    type: 'uuid',
    name: 'form_id',
    comment: 'relacion',
  })
  formId: string;

  /** Columns **/
  @Column({
    name: 'issued_at',
    type: 'date',
    comment: 'Fecha de emision',
  })
  issuedAt: Date;

  @Column({
    name: 'started_at',
    type: 'date',
    comment: 'Fecha de inicio',
  })
  startedAt: Date;

  @Column({
    name: 'ended_at',
    type: 'date',
    comment: 'Fecha de Fin',
  })
  endedAt: Date;

  @Column({
    name: 'observation',
    type: 'varchar',
    nullable: true,
    comment: 'Observaciones adicionales',
  })
  observation: string;

  @Column({
    name: 'location',
    type: 'varchar',
    comment: 'Lugar relacionado con el permiso',
  })
  location: string;

  @Column({
    name: 'unit',
    type: 'varchar',
    comment: 'Unidad a la que pertenece el usuario',
  })
  unit: string;

  @Column({
    name: 'position',
    type: 'varchar',
    comment: 'Cargo de la persona',
  })
  position: string;

  @Column({
    name: 'coordination',
    type: 'varchar',
    nullable: true,
    comment: 'Coordinacion Zonal 2 y 9',
  })
  coordination: string;
}
