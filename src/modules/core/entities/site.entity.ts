// src/modules/core/entities/site.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { EmployeeEntity } from './employee.entity';
import { ScheduleEntity } from './schedule.entity';

@Entity('sites', { schema: 'core' })
export class SiteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'name',
    type: 'varchar',
    length: 255,
    comment: 'Nombre del sitio',
  })
  name: string;

  @Column({
    name: 'latitude',
    type: 'decimal',
    precision: 10,
    scale: 8,
    comment: 'Latitud del sitio',
  })
  latitude: number;

  @Column({
    name: 'longitude',
    type: 'decimal',
    precision: 11,
    scale: 8,
    comment: 'Longitud del sitio',
  })
  longitude: number;

  @Column({
    name: 'radius',
    type: 'float',
    comment: 'Radio del sitio en metros',
  })
  radius: number;

  @ManyToOne(() => EmployeeEntity, { nullable: false })
  @JoinColumn({ name: 'employee_id' })
  employee: EmployeeEntity;

  @Column({
    name: 'employee_id',
    type: 'uuid',
  })
  employeeId: string;

  @ManyToMany(() => ScheduleEntity)
  @JoinTable({
    name: 'site_schedules',
    schema: 'core',
    joinColumn: {
      name: 'site_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'schedule_id',
      referencedColumnName: 'id',
    },
  })
  schedules: ScheduleEntity[];

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
}