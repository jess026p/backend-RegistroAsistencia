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
import { UserEntity } from '@auth/entities';

@Entity('horarios', { schema: 'core' })
export class HorarioEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    name: 'user_id',
    type: 'uuid',
    comment: 'ID del usuario al que pertenece el horario',
  })
  userId: string;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @Column({
    name: 'nombre_turno',
    type: 'varchar',
    nullable: true,
    comment: 'Nombre descriptivo del turno',
  })
  nombreTurno: string;

  @Column({
    name: 'dias',
    type: 'int',
    array: true,
    comment: 'Array de días de la semana (1-7)',
  })
  dias: number[];

  @Column({
    name: 'hora_inicio',
    type: 'time',
    comment: 'Hora de inicio del turno',
  })
  horaInicio: string;

  @Column({
    name: 'hora_fin',
    type: 'time',
    comment: 'Hora de fin del turno',
  })
  horaFin: string;

  @Column({
    name: 'fecha_inicio',
    type: 'date',
    nullable: true,
    comment: 'Fecha de inicio del horario',
  })
  fechaInicio: Date;

  @Column({
    name: 'fecha_fin',
    type: 'date',
    nullable: true,
    comment: 'Fecha de fin del horario',
  })
  fechaFin: Date;

  @Column({
    name: 'hora_almuerzo_salida',
    type: 'time',
    nullable: true,
    comment: 'Hora de salida para almuerzo',
  })
  horaAlmuerzoSalida: string;

  @Column({
    name: 'hora_almuerzo_regreso',
    type: 'time',
    nullable: true,
    comment: 'Hora de regreso del almuerzo',
  })
  horaAlmuerzoRegreso: string;

  @Column({
    name: 'tolerancia_inicio_antes',
    type: 'int',
    default: 5,
    comment: 'Tolerancia en minutos para entrada antes de la hora',
  })
  toleranciaInicioAntes: number;

  @Column({
    name: 'tolerancia_inicio_despues',
    type: 'int',
    default: 5,
    comment: 'Tolerancia en minutos para entrada después de la hora',
  })
  toleranciaInicioDespues: number;

  @Column({
    name: 'tolerancia_fin_despues',
    type: 'int',
    default: 5,
    comment: 'Tolerancia en minutos para salida después de la hora',
  })
  toleranciaFinDespues: number;

  @Column({
    name: 'repetir_turno',
    type: 'boolean',
    default: false,
    comment: 'Indica si el turno se repite',
  })
  repetirTurno: boolean;

  @Column({
    name: 'fecha_fin_repeticion',
    type: 'date',
    nullable: true,
    comment: 'Fecha hasta la que se repite el turno',
  })
  fechaFinRepeticion: Date;

  @Column({
    name: 'ubicacion_nombre',
    type: 'varchar',
    nullable: true,
    comment: 'Nombre de la ubicación',
  })
  ubicacionNombre: string;

  @Column({
    name: 'ubicacion_lat',
    type: 'double precision',
    nullable: true,
    comment: 'Latitud de la ubicación',
  })
  ubicacionLat: number;

  @Column({
    name: 'ubicacion_lng',
    type: 'double precision',
    nullable: true,
    comment: 'Longitud de la ubicación',
  })
  ubicacionLng: number;

  @Column({
    name: 'radio_ubicacion',
    type: 'int',
    nullable: true,
    comment: 'Radio de la ubicación en metros',
  })
  radioUbicacion: number;

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
} 