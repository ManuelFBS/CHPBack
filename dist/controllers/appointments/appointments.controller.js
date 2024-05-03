"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelledAppointment = exports.makeAppointment = void 0;
const Appointment_1 = require("../../entities/Appointment");
const User_1 = require("../../entities/User");
const appointment_types_1 = require("../../entities/appointment.types");
const database_1 = require("../../db/database");
const makeAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser, appointmentDate, appointmentTime, appointmentStatus, } = req.body;
        const bookingUser = yield User_1.User.findOne({
            where: { id: idUser },
        });
        if (!bookingUser)
            return res
                .status(404)
                .json({ message: 'User not found...!' });
        // Buscar si ya existe una cita en la misma fecha y hora
        const existingAppointment = yield Appointment_1.Appointment.findOne({
            where: {
                appointmentDate,
                appointmentTime,
                appointmentStatus: appointment_types_1.Appointment_Status.ACTIVE,
            },
        });
        if (existingAppointment) {
            return res.status(401).json({
                message: 'Hora reservada previamente por otro usuario. Debe escoger otra hora u otro día disponible...!',
            });
        }
        const newAppointment = new Appointment_1.Appointment();
        newAppointment.idUser = idUser;
        newAppointment.appointmentDate = appointmentDate;
        newAppointment.appointmentTime = appointmentTime;
        newAppointment.appointmentStatus = appointmentStatus;
        const bookedAppointment = yield Appointment_1.Appointment.save(newAppointment);
        // const bookingUser: any = await User.findOne({
        //   where: { id: idUser },
        // });
        const userData = {};
        userData.name = bookingUser.name;
        userData.lastName = bookingUser.lastName;
        userData.email = bookingUser.email;
        userData.phoneNumber = bookingUser.phoneNumber;
        userData.userName = bookingUser.userName;
        return res.status(201).json({
            message: 'The appointment has been booked successfully...!',
            userData,
            bookedAppointment,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.makeAppointment = makeAppointment;
const cancelledAppointment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { idUser, appointmentDate, appointmentTime, appointmentStatus, } = req.body;
        const appointmentUser = yield Appointment_1.Appointment.findOne({
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
        const dataSource = database_1.AppDataSource;
        const dataAppointment = {
            appointmentStatus: appointmentStatus,
        };
        dataSource
            .createQueryBuilder()
            .update(Appointment_1.Appointment)
            .set(dataAppointment)
            .where('idUser = :idUser AND appointmentDate = :appointmentDate AND appointmentTime = :appointmentTime', { idUser, appointmentDate, appointmentTime })
            .execute();
        return res.status(201).json({
            message: 'Your appointment has been cancelled...!',
        });
    }
    catch (error) {
        if (error instanceof Error) {
            return res.status(500).json({ error: error.message });
        }
        else {
            return res.status(500).json(error);
        }
    }
});
exports.cancelledAppointment = cancelledAppointment;
//# sourceMappingURL=appointments.controller.js.map