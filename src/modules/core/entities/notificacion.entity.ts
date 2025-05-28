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
} 