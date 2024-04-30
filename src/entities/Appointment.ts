import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Appointment_Time } from './appointment.time';

@Entity()
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: false,
  })
  lastName: string;

  @Column({
    type: 'varchar',
    length: 50,
    unique: true,
    nullable: false,
  })
  email: string;

  @Column({ type: 'varchar', length: 20, nullable: false })
  phoneNumber: string;

  @Column({ nullable: false })
  idUser: number;

  @Column({ type: 'date', nullable: false })
  appointmentDate: Date;

  @Column({ type: 'enum', enum: Appointment_Time })
  appointmentTime: Appointment_Time;

  @Column({ type: 'boolean', default: false })
  cancelled: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
