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
  import { VacationEntity } from './vacation.entity';

  @Entity('vacation-details', { schema: 'core' })
  export class VacationDetailEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /** Campos de creación, actualización y eliminación **/
    @CreateDateColumn({
      name: 'created_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      comment: 'Fecha de creación del registro de detalle de vacaciones',
    })
    createdAt: Date;

    @UpdateDateColumn({
      name: 'updated_at',
      type: 'timestamp',
      default: () => 'CURRENT_TIMESTAMP',
      comment: 'Fecha de última actualización del registro de detalle de vacaciones',
    })
    updatedAt: Date;

    @DeleteDateColumn({
      name: 'deleted_at',
      type: 'timestamp',
      nullable: true,
      comment: 'Fecha de eliminación del registro de detalle de vacaciones',
    })
    deletedAt: Date;

    /** Foreign Keys **/
    @ManyToOne(() => VacationEntity)
    @JoinColumn({ name: 'vacation_id' })
    vacation: VacationEntity;

    @Column({
      type: 'uuid',
      name: 'vacation_id',
      comment: 'Relación con VacationEntity',
    })
    vacationId: string;

    /** Columns **/
    @Column({
      name: 'month',
      type: 'integer',
      comment: 'Mes relacionado con el detalle de vacaciones',
    })
    month: number;

    @Column({
      name: 'year',
      type: 'integer',
      comment: 'Año relacionado con el detalle de vacaciones',
    })
    year: number;

    @Column({
      name: 'days',
      type: 'float',
      comment: 'Año relacionado con el detalle de vacaciones',
    })
    days: number;
  }
