import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  JoinColumn, OneToMany,
} from 'typeorm';
import { UserEntity } from '@auth/entities';
import { SignerEntity } from './signer.entity';
import { VacationDetailEntity } from './vacation-detail.entity';

@Entity('vacations', { schema: 'core' })
export class VacationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de creación del registro de vacaciones',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    comment: 'Fecha de última actualización del registro de vacaciones',
  })
  updatedAt: Date;

  @DeleteDateColumn({
    name: 'deleted_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de eliminación del registro de vacaciones',
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

  @OneToMany(() => VacationDetailEntity, vacationDetail => vacationDetail.vacation)
  vacationDetails: VacationDetailEntity[];

  /** Columns **/
}