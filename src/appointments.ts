import { Appointment, Prisma } from "@prisma/client";
import { prisma } from "./lib/prisma";

export type AppointmentWithRelations = Prisma.AppointmentGetPayload<{
  include: { patient: true; doctor: true };
}>;

export async function bookAppointment(
  patientId: number,
  doctorId: number,
  appointmentDate: Date
): Promise<AppointmentWithRelations> {
  return prisma.appointment.create({
    data: {
      appointmentDate,
      patient: { connect: { id: patientId } },
      doctor: { connect: { id: doctorId } }
    },
    include: { patient: true, doctor: true }
  });
}

export async function getAppointmentFull(id: number): Promise<AppointmentWithRelations | null> {
  return prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, doctor: true }
  });
}

export async function getDoctorUpcomingAppointments(
  doctorId: number
): Promise<AppointmentWithRelations[]> {
  return prisma.appointment.findMany({
    where: {
      doctorId,
      appointmentDate: { gte: new Date() },
      status: { not: "cancelled" }
    },
    include: { patient: true, doctor: true },
    orderBy: { appointmentDate: "asc" }
  });
}

export async function setAppointmentStatus(id: number, status: string): Promise<Appointment> {
  return prisma.appointment.update({ where: { id }, data: { status } });
}

export async function cancelAllPatientAppointments(patientId: number): Promise<Prisma.BatchPayload> {
  return prisma.appointment.updateMany({
    where: { patientId, status: { not: "cancelled" } },
    data: { status: "cancelled" }
  });
}

export async function deleteAppointment(id: number): Promise<Appointment> {
  return prisma.appointment.delete({ where: { id } });
}