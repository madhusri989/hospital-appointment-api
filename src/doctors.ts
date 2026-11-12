import { Doctor } from "@prisma/client";
import { prisma } from "./lib/prisma";

export async function createDoctor(name: string, specialty: string): Promise<Doctor> {
  return prisma.doctor.create({ data: { name, specialty } });
}

export async function getDoctor(id: number): Promise<Doctor | null> {
  return prisma.doctor.findUnique({ where: { id } });
}

export async function listDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
  return prisma.doctor.findMany({
    where: { specialty: { equals: specialty, mode: "insensitive" } },
    orderBy: { name: "asc" }
  });
}

export async function deleteDoctor(id: number): Promise<Doctor> {
  return prisma.doctor.delete({ where: { id } });
}