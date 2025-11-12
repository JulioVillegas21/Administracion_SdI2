import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Alert {
  id: string;
  type: "info" | "warning" | "success";
  message: string;
  time: string;
}

const alertConfig = {
  info: { icon: Bell, color: "text-primary" },
  warning: { icon: AlertCircle, color: "text-destructive" },
  success: { icon: CheckCircle, color: "text-green-600" },
};

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle>Notificaciones</CardTitle>
        <Button variant="ghost" size="sm" data-testid="button-clear-alerts">
          Marcar leídas
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => {
            const Icon = alertConfig[alert.type].icon;
            return (
              <div
                key={alert.id}
                className="flex gap-3"
                data-testid={`alert-${alert.id}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 ${alertConfig[alert.type].color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {alert.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
