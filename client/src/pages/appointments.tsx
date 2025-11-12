import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar, Clock, User, Phone, Stethoscope, FileText, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Appointment, Doctor } from "@shared/schema";

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const },
  confirmed: { label: "Confirmada", variant: "default" as const },
  completed: { label: "Completada", variant: "outline" as const },
};

export default function Appointments() {
  const [open, setOpen] = useState(false);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const { toast } = useToast();

  const { data: appointments, isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/appointments"],
  });

  const { data: allDoctors } = useQuery<Doctor[]>({
    queryKey: ["/api/doctors"],
  });

  // Get unique specialties
  const specialties = Array.from(
    new Set(allDoctors?.map(d => d.specialty) || [])
  ).sort();

  // Filter doctors based on selected specialty
  const filteredDoctors = selectedSpecialty
    ? allDoctors?.filter(d => d.specialty === selectedSpecialty) || []
    : allDoctors || [];

  // Update available slots when doctor is selected
  useEffect(() => {
    if (selectedDoctor && allDoctors) {
      const doctor = allDoctors.find(d => d.name === selectedDoctor);
      if (doctor) {
        setAvailableSlots(doctor.availableSlots);
        // If specialty wasn't selected, auto-fill it
        if (!selectedSpecialty) {
          setSelectedSpecialty(doctor.specialty);
        }
      }
    } else {
      setAvailableSlots([]);
    }
  }, [selectedDoctor, allDoctors, selectedSpecialty]);

  // Reset doctor selection when specialty changes
  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialty(specialty);
    // Only reset doctor if it doesn't match the new specialty
    if (selectedDoctor && allDoctors) {
      const doctor = allDoctors.find(d => d.name === selectedDoctor);
      if (doctor && doctor.specialty !== specialty) {
        setSelectedDoctor("");
        setAvailableSlots([]);
      }
    }
  };

  // Reset form when dialog closes
  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedSpecialty("");
      setSelectedDoctor("");
      setAvailableSlots([]);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest("POST", "/api/appointments", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      setOpen(false);
      toast({
        title: "Cita creada",
        description: "La cita se ha reservado exitosamente",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear la cita",
        variant: "destructive",
      });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/appointments/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/appointments"] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la cita se ha actualizado",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      patientName: formData.get("patientName") as string,
      patientPhone: formData.get("patientPhone") as string,
      doctor: formData.get("doctor") as string,
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      reason: formData.get("reason") as string,
      status: "pending",
    };
    createMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">Cargando citas...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Gestión de Citas</h1>
          <p className="text-sm text-muted-foreground">
            Programa y administra las citas médicas
          </p>
        </div>
        <Dialog open={open} onOpenChange={handleOpenChange}>
          <DialogTrigger asChild>
            <Button data-testid="button-new-appointment">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Cita
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Reservar Nueva Cita</DialogTitle>
              <DialogDescription>
                Complete los datos del paciente y la cita médica
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="patientName">Nombre del Paciente</Label>
                  <Input
                    id="patientName"
                    name="patientName"
                    placeholder="Ej: María García"
                    required
                    data-testid="input-patient-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientPhone">Teléfono</Label>
                  <Input
                    id="patientPhone"
                    name="patientPhone"
                    placeholder="Ej: +1234567890"
                    required
                    data-testid="input-patient-phone"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialty">Especialidad</Label>
                <Select 
                  value={selectedSpecialty}
                  onValueChange={handleSpecialtyChange}
                >
                  <SelectTrigger data-testid="select-specialty">
                    <SelectValue placeholder="Seleccione una especialidad" />
                  </SelectTrigger>
                  <SelectContent>
                    {specialties.map(specialty => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select 
                  name="doctor" 
                  value={selectedDoctor}
                  onValueChange={setSelectedDoctor}
                  required
                >
                  <SelectTrigger data-testid="select-doctor">
                    <SelectValue placeholder="Seleccione un doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredDoctors.map(doctor => (
                      <SelectItem key={doctor.id} value={doctor.name}>
                        {doctor.name} - {doctor.specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="date">Fecha</Label>
                  <Input
                    id="date"
                    name="date"
                    type="date"
                    required
                    data-testid="input-date"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time">Turno Disponible</Label>
                  <Select name="time" required disabled={!selectedDoctor}>
                    <SelectTrigger data-testid="select-time">
                      <SelectValue placeholder={selectedDoctor ? "Seleccione un turno" : "Primero seleccione un doctor"} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableSlots.map(slot => (
                        <SelectItem key={slot} value={slot}>
                          {slot}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Motivo de la Consulta</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Describa el motivo de la consulta"
                  required
                  data-testid="textarea-reason"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={createMutation.isPending} data-testid="button-submit">
                  {createMutation.isPending ? "Guardando..." : "Reservar Cita"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {appointments && appointments.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No hay citas programadas</p>
              <p className="text-sm text-muted-foreground mt-1">
                Haz clic en "Nueva Cita" para programar una
              </p>
            </CardContent>
          </Card>
        ) : (
          appointments?.map((appointment) => (
            <Card key={appointment.id} data-testid={`appointment-card-${appointment.id}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{appointment.patientName}</CardTitle>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(appointment.date).toLocaleDateString('es-ES')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {appointment.time}
                      </div>
                      <div className="flex items-center gap-1">
                        <Stethoscope className="w-4 h-4" />
                        {appointment.doctor}
                      </div>
                      <div className="flex items-center gap-1">
                        <Phone className="w-4 h-4" />
                        {appointment.patientPhone}
                      </div>
                    </div>
                  </div>
                  <Badge variant={statusConfig[appointment.status as keyof typeof statusConfig].variant}>
                    {statusConfig[appointment.status as keyof typeof statusConfig].label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Motivo de consulta:</p>
                    <p className="text-sm text-muted-foreground">{appointment.reason}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-4">
                  {appointment.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: appointment.id, status: "confirmed" })
                      }
                      data-testid={`button-confirm-${appointment.id}`}
                    >
                      Confirmar
                    </Button>
                  )}
                  {appointment.status === "confirmed" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        updateStatusMutation.mutate({ id: appointment.id, status: "completed" })
                      }
                      data-testid={`button-complete-${appointment.id}`}
                    >
                      Marcar como Completada
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
