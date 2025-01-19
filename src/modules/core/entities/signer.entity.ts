import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FormEntity } from './form.entity';

@Entity('signers', { schema: 'core' })
export class SignerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
  @ManyToOne(() => FormEntity)
  @JoinColumn({ name: 'form_id' })
  form: FormEntity;
  @Column({
    type: 'uuid',
    name: 'form_id',
    comment: 'relacion con el formulario',
  })
  formId: string;

  /** Columns **/
  @Column({
    name: 'signer_name',
    type: 'varchar',
    comment: 'Nombre del firmante',
  })
  signerName: string;

  @Column({
    name: 'position',
    type: 'varchar',
    comment: 'Cargo del firmante',
  })
  position: string;
}