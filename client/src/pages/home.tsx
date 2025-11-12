import { DashboardStats } from "@/components/dashboard-stats";
import { RecentAppointments } from "@/components/recent-appointments";
import { AlertsPanel } from "@/components/alerts-panel";
import { ModuleCards } from "@/components/module-cards";
import { Calendar, Users, Clock, DollarSign, Package, FileText, Settings, Stethoscope } from "lucide-react";

export default function Home() {
  const stats = [
    {
      title: "Citas Hoy",
      value: "24",
      icon: <Calendar className="w-4 h-4" />,
      trend: "+12% vs ayer",
    },
    {
      title: "Pacientes Activos",
      value: "1,429",
      icon: <Users className="w-4 h-4" />,
      trend: "+8% este mes",
    },
    {
      title: "Tiempo Promedio",
      value: "32 min",
      icon: <Clock className="w-4 h-4" />,
      trend: "-5 min vs semana",
    },
    {
      title: "Ingresos Hoy",
      value: "$12,450",
      icon: <DollarSign className="w-4 h-4" />,
      trend: "+18% vs ayer",
    },
  ];

  const appointments = [
    {
      id: "1",
      patientName: "María García López",
      time: "09:00",
      doctor: "Rodríguez",
      status: "confirmed" as const,
    },
    {
      id: "2",
      patientName: "Juan Pérez Sánchez",
      time: "10:30",
      doctor: "Martínez",
      status: "pending" as const,
    },
    {
      id: "3",
      patientName: "Ana Torres Díaz",
      time: "11:00",
      doctor: "López",
      status: "completed" as const,
    },
    {
      id: "4",
      patientName: "Carlos Ruiz Fernández",
      time: "12:00",
      doctor: "Gómez",
      status: "confirmed" as const,
    },
    {
      id: "5",
      patientName: "Laura Martín Castro",
      time: "14:30",
      doctor: "Rodríguez",
      status: "pending" as const,
    },
  ];

  const alerts = [
    {
      id: "1",
      type: "warning" as const,
      message: "Cita de María García sin confirmar",
      time: "Hace 5 min",
    },
    {
      id: "2",
      type: "info" as const,
      message: "Nueva cita programada para mañana",
      time: "Hace 15 min",
    },
    {
      id: "3",
      type: "success" as const,
      message: "Inventario actualizado correctamente",
      time: "Hace 1 hora",
    },
    {
      id: "4",
      type: "warning" as const,
      message: "Stock bajo en medicamento Paracetamol",
      time: "Hace 2 horas",
    },
  ];

  const modules = [
    {
      title: "Pacientes",
      description: "Gestión completa de historiales médicos y datos de pacientes",
      icon: Users,
      href: "#pacientes",
    },
    {
      title: "Citas",
      description: "Programación y seguimiento de citas médicas",
      icon: Calendar,
      href: "#citas",
    },
    {
      title: "Personal Médico",
      description: "Administración de médicos, horarios y turnos",
      icon: Stethoscope,
      href: "#personal",
    },
    {
      title: "Inventario",
      description: "Control de medicamentos y suministros médicos",
      icon: Package,
      href: "#inventario",
    },
    {
      title: "Reportes",
      description: "Generación de reportes y análisis estadísticos",
      icon: FileText,
      href: "#reportes",
    },
    {
      title: "Configuración",
      description: "Ajustes del sistema y preferencias",
      icon: Settings,
      href: "#configuracion",
    },
  ];

  const currentDate = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm text-muted-foreground capitalize">{currentDate}</p>
      </div>

      <DashboardStats stats={stats} />

      <div className="grid gap-6 lg:grid-cols-2">
        <RecentAppointments appointments={appointments} />
        <AlertsPanel alerts={alerts} />
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Acceso Rápido a Módulos</h2>
        <ModuleCards modules={modules} />
      </div>
    </div>
  );
}
