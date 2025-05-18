import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '@auth/entities';
import { HorarioEntity } from './horario.entity';

@Entity('asistencias', { schema: 'core' })
export class AsistenciaEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({ name: 'horario_id', type: 'uuid' })
  horarioId: string;

  @ManyToOne(() => HorarioEntity)
  @JoinColumn({ name: 'horario_id' })
  horario: HorarioEntity;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora: string;

  @Column({ type: 'double precision' })
  lat: number;

  @Column({ type: 'double precision' })
  lng: number;

  @Column({ type: 'varchar' })
  estado: 'entrada' | 'salida' | 'atraso' | 'fuera_de_zona' | 'fuera_de_rango';

  @Column({ type: 'varchar', nullable: true })
  motivo: string;

  @Column({ type: 'varchar' })
  tipo: 'entrada' | 'salida';

  @Column({ name: 'atraso_permitido', type: 'int', default: 0 })
  atrasoPermitido: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
} 