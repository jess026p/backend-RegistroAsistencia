import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { SignerEntity } from '@core/entities';

@Entity('forms', { schema: 'core' })
export class FormEntity {
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
  @OneToMany(() => SignerEntity, signer => signer.form)
  signers: SignerEntity[];

  /** Columns **/
  @Column({
    name: 'name',
    type: 'varchar',
    comment: 'Nombre de la institucion',
  })
  title: string;

  @Column({
    name: 'logo',
    type: 'varchar',
    nullable: true,
    comment: 'logo',
  })
  logo: string;
}
