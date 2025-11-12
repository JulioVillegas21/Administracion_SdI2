import { Calendar, Home, Briefcase } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const menuItems = [
  {
    title: "Inicio",
    url: "/",
    icon: Home,
  },
  {
    title: "Citas",
    url: "/citas",
    icon: Calendar,
  },
  {
    title: "Consultorio",
    url: "#consultorio",
    icon: Briefcase,
  },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <img 
            src="https://img.freepik.com/vector-premium/diseno-logotipo-clinica-medica-concepto-creativo-unico_526458-2787.jpg"
            alt="ClínicaPro Logo"
            className="w-10 h-10 rounded-md object-cover"
          />
          <div>
            <h2 className="text-lg font-semibold">Medical Clinica</h2>
            <p className="text-xs text-muted-foreground">Gestión Médica</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Módulos Principales</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild data-testid={`link-${item.title.toLowerCase()}`}>
                    <a href={item.url}>
                      <item.icon className="w-4 h-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t">
        <div className="flex items-start gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="https://i.postimg.cc/tCfsWxB2/Captura-de-pantalla-2025-11-12-001220.png" alt="Usuario" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium">Administrador</span>
            </div>
            <p className="text-sm font-medium mt-1">Fran Blason</p>
            <button 
              className="text-xs text-muted-foreground hover:text-foreground mt-1 hover-elevate active-elevate-2 rounded px-1 -mx-1"
              data-testid="link-my-account"
            >
              Mi cuenta
            </button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
