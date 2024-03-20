import { Schedule } from '../entities/Schedule';

export interface ScheduleEntity extends Schedule {
  email: string;
  phoneNumber: string;
  appointmentDate: Date;
}
