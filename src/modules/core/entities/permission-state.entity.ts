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
import { PermissionEntity } from './permission.entity';

@Entity('permission_states', { schema: 'core' })
export class PermissionStateEntity {
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
  @ManyToOne(() => PermissionEntity)
  @JoinColumn({ name: 'permission_id' })
  permission: PermissionEntity;

  @Column({
    type: 'uuid',
    name: 'permission_id',
    comment: 'Relación con permiso',
  })
  permissionId: string;

  @ManyToOne(() => CatalogueEntity)
  @JoinColumn({ name: 'state_id' })
  state: CatalogueEntity;

  @Column({
    type: 'uuid',
    name: 'state_id',
    comment: 'Relación con estado en CatalogueEntity',
  })
  stateId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    type: 'uuid',
    name: 'user_id',
    comment: 'Usuario que registró el estado',
  })
  userId: string;

  /** Columns **/
  @Column({
    name: 'is_current',
    type: 'boolean',
    default: true,
    comment: 'Esto es para saber cual es el estado actual',
  })
  isCurrent: boolean;

  @Column({
    name: 'registered_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha en la que se registró el estado del permiso',
  })
  registeredAt: Date;
}
