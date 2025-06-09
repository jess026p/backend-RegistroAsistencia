import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  BeforeInsert,
  BeforeUpdate,
  ManyToMany, OneToMany, OneToOne,
} from 'typeorm';
import * as Bcrypt from 'bcrypt';
import { RoleEntity } from '@auth/entities';
import { CatalogueEntity } from '@common/entities';
import { AttendanceEntity, PermissionStateEntity, PermissionEntity, VacationEntity } from '@core/entities';
import { EmployeeEntity } from '../../core/entities/employee.entity';
import { HorarioEntity } from '../../core/entities/horario.entity';

@Entity('users', { schema: 'auth' })
export class UserEntity {
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

  /** Inverse Relationship **/
  @ManyToMany(() => RoleEntity, role => role.users)
  roles: RoleEntity[];

  @OneToMany(() => AttendanceEntity, attendance => attendance.employee)
  attendances: EmployeeEntity[];

  @OneToMany(() => PermissionEntity, permission => permission.user)
  permissions: PermissionEntity[];

  @OneToMany(() => PermissionStateEntity, permissionState => permissionState.user)
  permissionStates: PermissionStateEntity[];

  @OneToMany(() => VacationEntity, vacation => vacation.user)
  vacations: VacationEntity[];

  @OneToOne(() => EmployeeEntity, (employee) => employee.user)
  employee: EmployeeEntity;

  @OneToMany(() => HorarioEntity, horario => horario.user)
  horarios: HorarioEntity[];

  /** Foreign Keys **/
  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'blood_type_id' })
  bloodType: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'blood_type_id',
    nullable: true,
    comment: 'A+, A-, B+, B-, AB+ AB-, O+, O-',
  })
  bloodTypeId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'ethnic_origin_id' })
  ethnicOrigin: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'ethnic_origin_id',
    nullable: true,
    comment: 'Blanco, Mestizo, Indigena, Afroecuatoriano, Montubio',
  })
  ethnicOriginId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'gender_id' })
  gender: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'gender_id',
    nullable: true,
    comment: 'Masculino, Femenino, LGBTI, Otro',
  })
  genderId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'identification_type_id' })
  identificationType: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'identification_type_id',
    nullable: true,
    comment: 'Cédula o Pasaporte',
  })
  identificationTypeId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'marital_status_id' })
  maritalStatus: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'marital_status_id',
    nullable: true,
    comment: 'Soltero, Casado, Viudo, Divorciado, Union Libre, Separado no legal',
  })
  maritalStatusId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'nationality_id' })
  nationality: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'nationality_id',
    nullable: true,
    comment: 'Ecuatoriana, Argentina etc',
  })
  nationalityId: string;

  @ManyToOne(() => CatalogueEntity, { nullable: true })
  @JoinColumn({ name: 'sex_id' })
  sex: CatalogueEntity;
  @Column({
    type: 'uuid',
    name: 'sex_id',
    nullable: true,
    comment: 'Hombre o Mujer',
  })
  sexId: string;




/** Columns **/
  @Column({
    name: 'activated_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de ultimo login',
  })
  activatedAt: Date;

  @Column({
    name: 'avatar',
    type: 'varchar',
    nullable: true,
    comment: 'Imagen del Avatar del usuario',
  })
  avatar: string;

  @Column({
    name: 'cell_phone',
    type: 'varchar',
    nullable: true,
    comment: 'Teléfono Celular',
  })
  cellPhone: string;

  @Column({
    name: 'email',
    type: 'varchar',
    unique: true,
    comment: 'Correo Electronico',
  })
  email: string;

  @Column({
    name: 'birthdate',
    type: 'date',
    nullable: true,
    comment: 'Fecha de nacimiento',
  })
  birthdate: string;

  @Column({
    name: 'email_verified_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Verificacion de correo',
  })
  emailVerifiedAt: Date;

  @Column({
    name: 'identification',
    type: 'varchar',
    comment: 'Numero de documento puede ser la cedula',
  })
  identification: string;

  @Column({
    name: 'lastname',
    type: 'varchar',
    nullable: true,
    comment: 'Apellidos',
  })
  lastname: string;

  @Column({
    name: 'password',
    type: 'varchar',
    comment: 'Contraseña',
    select: false,
  })
  password: string;

  @Column({
    name: 'password_changed',
    type: 'boolean',
    default: false,
    comment: 'true: ya cambió la contraseña y False:no',
  })
  passwordChanged: boolean;

  @Column({
    name: 'personal_email',
    type: 'varchar',
    nullable: true,
    comment: 'Correo Electronico Personal',
  })
  personalEmail: string;

  @Column({
    name: 'phone',
    type: 'varchar',
    nullable: true,
    comment: 'Teléfono',
  })
  phone: string;

  @Column({
    name: 'max_attempts',
    type: 'int',
    default: 3,
    comment: 'Intentos máximos para errar la contraseña, si llega a cero el usuario se bloquea',
  })
  maxAttempts: number;

  @Column({
    name: 'name',
    type: 'varchar',
    nullable: true,
    comment: 'Nombres del usuario',
  })
  name: string;

  @Column({
    name: 'suspended_at',
    type: 'timestamp',
    nullable: true,
    comment: 'Fecha de la ultima suspension del usuario',
  })
  suspendedAt: Date;

  @Column({
    name: 'username',
    type: 'varchar',
    unique: true,
    comment: 'Nombre de usuario para ingreso al sistema',
  })
  username: string;

  @Column({
    name: 'enabled',
    type: 'boolean',
    default: true,
    comment: 'Indica si el usuario está habilitado para acceder al sistema',
  })
  enabled: boolean;

  /** Before Actions **/
  @BeforeInsert()
  @BeforeUpdate()
  hashPassword() {
    if (!this.password || this.password?.length > 30) {
      return;
    }

    this.password = Bcrypt.hashSync(this.password, 10);
  }

  @BeforeInsert()
  @BeforeUpdate()
  async checkBirthdate() {
    if (!this.birthdate) {
      return;
    }
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setEmail() {
    if (!this.email) {
      return;
    }
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeInsert()
  @BeforeUpdate()
  async setPersonalEmail() {
    if (!this.personalEmail) {
      return;
    }
    this.personalEmail = this.personalEmail.toLowerCase().trim();
  }
}
