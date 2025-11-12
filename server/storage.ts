import { type User, type InsertUser, type Appointment, type InsertAppointment, type Doctor, type InsertDoctor } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllAppointments(): Promise<Appointment[]>;
  getAppointment(id: string): Promise<Appointment | undefined>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined>;
  
  getAllDoctors(): Promise<Doctor[]>;
  getDoctorsBySpecialty(specialty: string): Promise<Doctor[]>;
  getDoctor(id: string): Promise<Doctor | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private appointments: Map<string, Appointment>;
  private doctors: Map<string, Doctor>;

  constructor() {
    this.users = new Map();
    this.appointments = new Map();
    this.doctors = new Map();
    this.initializeDoctors();
  }

  private initializeDoctors() {
    const doctorsData: Array<Omit<Doctor, 'id'>> = [
      {
        name: "Dr. Rodríguez",
        specialty: "Cardiología",
        availableSlots: ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"],
      },
      {
        name: "Dr. Martínez",
        specialty: "Pediatría",
        availableSlots: ["08:00", "09:00", "10:00", "11:00", "15:00", "16:00", "17:00"],
      },
      {
        name: "Dra. López",
        specialty: "Dermatología",
        availableSlots: ["09:30", "10:30", "11:30", "14:30", "15:30", "16:30"],
      },
      {
        name: "Dr. Gómez",
        specialty: "Traumatología",
        availableSlots: ["08:00", "09:00", "10:00", "13:00", "14:00", "15:00"],
      },
      {
        name: "Dra. Fernández",
        specialty: "Cardiología",
        availableSlots: ["10:00", "11:00", "12:00", "15:00", "16:00", "17:00"],
      },
    ];

    doctorsData.forEach(doctor => {
      const id = randomUUID();
      this.doctors.set(id, { ...doctor, id });
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllAppointments(): Promise<Appointment[]> {
    return Array.from(this.appointments.values()).sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    return this.appointments.get(id);
  }

  async createAppointment(insertAppointment: InsertAppointment): Promise<Appointment> {
    const id = randomUUID();
    const appointment: Appointment = {
      ...insertAppointment,
      id,
      status: insertAppointment.status || "pending",
      createdAt: new Date(),
    };
    this.appointments.set(id, appointment);
    return appointment;
  }

  async updateAppointmentStatus(id: string, status: string): Promise<Appointment | undefined> {
    const appointment = this.appointments.get(id);
    if (!appointment) return undefined;
    
    const updated = { ...appointment, status };
    this.appointments.set(id, updated);
    return updated;
  }

  async getAllDoctors(): Promise<Doctor[]> {
    return Array.from(this.doctors.values()).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
  }

  async getDoctorsBySpecialty(specialty: string): Promise<Doctor[]> {
    return Array.from(this.doctors.values())
      .filter(doctor => doctor.specialty === specialty)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async getDoctor(id: string): Promise<Doctor | undefined> {
    return this.doctors.get(id);
  }
}

export const storage = new MemStorage();
