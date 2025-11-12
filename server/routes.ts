import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAppointmentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all doctors
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener médicos" });
    }
  });

  // Get doctors by specialty
  app.get("/api/doctors/specialty/:specialty", async (req, res) => {
    try {
      const { specialty } = req.params;
      const doctors = await storage.getDoctorsBySpecialty(specialty);
      res.json(doctors);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener médicos" });
    }
  });

  // Get all appointments
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAllAppointments();
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Error al obtener citas" });
    }
  });

  // Create new appointment
  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);
      res.status(201).json(appointment);
    } catch (error) {
      res.status(400).json({ error: "Datos inválidos" });
    }
  });

  // Update appointment status
  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const appointment = await storage.updateAppointmentStatus(id, status);
      if (!appointment) {
        return res.status(404).json({ error: "Cita no encontrada" });
      }
      
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Error al actualizar cita" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
