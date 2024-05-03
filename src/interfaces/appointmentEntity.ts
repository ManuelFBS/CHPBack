import { Appointment } from '../entities/Appointment';
import { Appointment_Time } from '../entities/appointment.types';

export interface AppointmentEntity extends Appointment {
  idUser: number;
  appointmentDate: Date;
  appointmentTime: Appointment_Time;
  cancelled: boolean;
}
