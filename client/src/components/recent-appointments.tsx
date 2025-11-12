import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";

export interface Appointment {
  id: string;
  patientName: string;
  time: string;
  doctor: string;
  status: "pending" | "confirmed" | "completed";
}

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const },
  confirmed: { label: "Confirmada", variant: "default" as const },
  completed: { label: "Completada", variant: "outline" as const },
};

export function RecentAppointments({ appointments }: { appointments: Appointment[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>Citas Recientes</CardTitle>
        <Button variant="ghost" size="sm" data-testid="button-view-all">
          Ver todas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center gap-4"
              data-testid={`appointment-${appointment.id}`}
            >
              <Avatar>
                <AvatarFallback>
                  {appointment.patientName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{appointment.patientName}</p>
                <p className="text-xs text-muted-foreground">
                  {appointment.time} - Dr. {appointment.doctor}
                </p>
              </div>
              <Badge variant={statusConfig[appointment.status].variant}>
                {statusConfig[appointment.status].label}
              </Badge>
              <Button variant="ghost" size="icon" data-testid={`button-appointment-menu-${appointment.id}`}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
