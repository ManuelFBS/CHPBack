import { Appointment } from '../entities/Appointment';
import { Appointment_Time } from '../entities/appointment.time';

export interface AppointmentEntity extends Appointment {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  idUser: number;
  appointmentDate: Date;
  appointmentTime: Appointment_Time;
  cancelled: boolean;
}
