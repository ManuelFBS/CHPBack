import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  Appointment_Status,
  Appointment_Time,
} from './appointment.types';

@Entity()
export class Appointment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  idUser: number;

  @Column({ type: 'date', nullable: false })
  appointmentDate: Date;

  @Column({ type: 'enum', enum: Appointment_Time })
  appointmentTime: Appointment_Time;

  @Column({
    type: 'enum',
    enum: Appointment_Status,
    default: Appointment_Status.ACTIVE,
  })
  appointmentStatus: Appointment_Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
