import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
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
  estado: string; // Aquí puedes usar 'entrada' o 'salida'

  @Column({ type: 'varchar', nullable: true })
  motivo: string;

  @Column({ type: 'time', nullable: true })
  hora_salida: string;

  @Column({ type: 'double precision', nullable: true })
  lat_salida: number;

  @Column({ type: 'double precision', nullable: true })
  lng_salida: number;

  @Column({ type: 'varchar', nullable: true })
  estado_salida: string;

  @Column({ type: 'varchar', nullable: true })
  motivo_salida: string;

  @Column({ type: 'interval', nullable: true })
  tiempo_total: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
