import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('notificaciones', { schema: 'core' })
export class NotificacionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ type: 'varchar' })
  mensaje: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'date', nullable: true })
  fecha: string;

  @Column({ type: 'varchar', length: 5, nullable: true })
  hora: string;

  @Column({ type: 'varchar', default: 'info' })
  tipo: 'success' | 'error' | 'warning' | 'info';
} 