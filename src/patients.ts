import { Patient, Prisma } from "@prisma/client";
import { prisma } from "./lib/prisma";

export async function createPatient(name: string, phone: string, dateOfBirth: Date): Promise<Patient> {
  return prisma.patient.create({ data: { name, phone, dateOfBirth } });
}

export async function getPatient(id: number): Promise<Patient | null> {
  return prisma.patient.findUnique({ where: { id } });
}

export async function searchPatients(query: string): Promise<Patient[]> {
  const where: Prisma.PatientWhereInput = {
    OR: [
      { name: { contains: query, mode: "insensitive" } },
      { phone: { contains: query } }
    ]
  };
  return prisma.patient.findMany({ where, orderBy: { name: "asc" } });
}

export async function updatePatientPhone(id: number, phone: string): Promise<Patient> {
  return prisma.patient.update({ where: { id }, data: { phone } });
}

export async function deletePatient(id: number): Promise<Patient> {
  return prisma.patient.delete({ where: { id } });
}