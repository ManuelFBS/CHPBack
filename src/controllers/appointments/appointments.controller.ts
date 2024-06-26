import { Request, Response } from 'express';
import { Appointment } from '../../entities/Appointment';
import { User } from '../../entities/User';
import {
  Appointment_Status,
  Appointment_Time,
} from '../../entities/appointment.types';
import { AppDataSource } from '../../db/database';

interface UserData {
  name?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  userName?: string;
}

// Crear citas...
export const makeAppointment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const {
      idUser,
      appointmentDate,
      appointmentTime,
      appointmentStatus,
    }: {
      idUser: number;
      // appointmentDate: Date;
      appointmentDate: string;
      appointmentTime: Appointment_Time;
      appointmentStatus: Appointment_Status;
    } = req.body;

    const parsedDate = new Date(appointmentDate);
    if (isNaN(parsedDate.getTime())) {
      return res
        .status(400)
        .json({ message: 'Invalid date format...' });
    }

    const bookingUser: any = await User.findOne({
      where: { id: idUser },
    });

    if (!bookingUser)
      return res
        .status(404)
        .json({ message: 'User not found...!' });

    // Buscar si ya existe una cita en la misma fecha y hora
    const existingAppointment = await Appointment.findOne({
      where: {
        appointmentDate: parsedDate,
        appointmentTime,
        appointmentStatus: Appointment_Status.ACTIVE,
      },
    });

    if (existingAppointment) {
      return res.status(401).json({
        message:
          'Hora reservada previamente por otro usuario. Debe escoger otra hora u otro día disponible...!',
      });
    }

    const newAppointment = new Appointment();
    newAppointment.idUser = idUser;
    newAppointment.appointmentDate = parsedDate;
    newAppointment.appointmentTime = appointmentTime;
    newAppointment.appointmentStatus = appointmentStatus;

    const bookedAppointment = await Appointment.save(
      newAppointment,
    );

    const userData: UserData = {};
    userData.name = bookingUser.name;
    userData.lastName = bookingUser.lastName;
    userData.email = bookingUser.email;
    userData.phoneNumber = bookingUser.phoneNumber;
    userData.userName = bookingUser.userName;

    return res.status(201).json({
      message:
        'The appointment has been booked successfully...!',
      userData,
      bookedAppointment,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};

export const cancelledAppointment = async (
  req: Request,
  res: Response,
): Promise<Response> => {
  try {
    const {
      idUser,
      appointmentDate,
      appointmentTime,
      appointmentStatus,
    }: {
      idUser: number;
      appointmentDate: Date;
      appointmentTime: Appointment_Time;
      appointmentStatus: Appointment_Status;
    } = req.body;

    const appointmentUser = await Appointment.findOne({
      where: {
        idUser,
        appointmentDate,
        appointmentTime,
      },
    });

    if (!appointmentUser)
      return res
        .status(404)
        .json({ message: 'Appointment not found...!' });

    const dataSource = AppDataSource;
    const dataAppointment: Appointment[] | any = {
      appointmentStatus: appointmentStatus,
    };

    dataSource
      .createQueryBuilder()
      .update(Appointment)
      .set(dataAppointment)
      .where(
        'idUser = :idUser AND appointmentDate = :appointmentDate AND appointmentTime = :appointmentTime',
        { idUser, appointmentDate, appointmentTime },
      )
      .execute();

    return res.status(201).json({
      message: 'Your appointment has been cancelled...!',
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message });
    } else {
      return res.status(500).json(error);
    }
  }
};
