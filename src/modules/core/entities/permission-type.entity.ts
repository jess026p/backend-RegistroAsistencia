import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn, OneToMany,
} from 'typeorm';
import { PermissionEntity } from './permission.entity';

@Entity('permission_types', { schema: 'core' })
export class PermissionTypeEntity {
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


  /** Inverse Relationship **/
  @OneToMany(() => PermissionEntity, permission => permission.permissionType)
  permissions: PermissionEntity[];

  /** Columns **/
  @Column({
    name: 'name',
    type: 'varchar',
    comment:'tipo de permiso'
  })
  name: string;

  @Column({
    name: 'is_discountable',
    type: 'boolean',
    comment:'Si los tipos de permiso son descontables o no'
  })
  is_discountable: boolean;
}
