import { Request, Response } from 'express';
import { Appointment } from '../../entities/Appointment';
import { Appointment_Time } from '../../entities/appointment.time';

export const makeAppointment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const {
      name,
      lastName,
      email,
      phoneNumber,
      idUser,
      appointmentDate,
      appointmentTime,
      cancelled,
    }: {
      name: string;
      lastName: string;
      email: string;
      phoneNumber: string;
      idUser: number;
      appointmentDate: Date;
      appointmentTime: Appointment_Time;
      cancelled: boolean;
    } = req.body;

    // Buscar si ya existe una cita en la misma fecha y hora
    const existingAppointment = await Appointment.findOne({
      where: {
        appointmentDate,
        appointmentTime,
      },
    });

    if (existingAppointment)
      return res.status(401).json({
        message:
          'Hora reservada previamente por otro usuario.\nDebe escoger otra hora u otro día disponible...!',
      });

    const newAppointment = new Appointment();
    newAppointment.name = name;
    newAppointment.lastName = lastName;
    newAppointment.email = email;
    newAppointment.phoneNumber = phoneNumber;
    newAppointment.idUser = idUser;
    newAppointment.appointmentDate = appointmentDate;
    newAppointment.appointmentTime = appointmentTime;
    newAppointment.cancelled = cancelled;

    const reservedAppointment = await Appointment.save(
      newAppointment,
    );

    return res.status(201).json({
      message:
        'The booked appointment has been booked successfully...!',
      reservedAppointment,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};
