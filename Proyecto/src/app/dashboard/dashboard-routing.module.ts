import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventosComponent } from './eventos/eventos.component';
import { RegistrarEventoComponent } from './eventos/registrar-evento/registrar-evento.component';
//import { SidebarComponent } from './sidebar/sidebar.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { UbicacionesComponent } from './ubicaciones/ubicaciones.component';
import { RegistrarUbicacionComponent } from './ubicaciones/registrar-ubicacion/registrar-ubicacion.component';
import { EditarUbicacionComponent } from './ubicaciones/editar-ubicacion/editar-ubicacion.component';
import { RecuperarLugarComponent } from './ubicaciones/recuperar-lugar/recuperar-lugar.component';
import { RecuperarUbicacionComponent } from './ubicaciones/recuperar-ubicacion/recuperar-ubicacion.component';

const routes: Routes = [
  {path:"dashboard/home", component:DashboardComponent},
  //{path:"sidebar", component:SidebarComponent},
  {path:"dashboard/eventos", component:EventosComponent},
  {path:"dashboard/eventos/registrar", component:RegistrarEventoComponent},
  {path:"dashboard/usuarios/registrar", component:RegistroUsuarioComponent},
  {path:"dashboard/ubicaciones", component:UbicacionesComponent},
  {path:"dashboard/ubicaciones/registrar", component:RegistrarUbicacionComponent},
  {path:"dashboard/ubicaciones/editar/:idUbicacion",component:EditarUbicacionComponent},
  {path:"dashboard/ubicaciones/editar/recuperar/lugares/:idUbicacion",component:RecuperarLugarComponent},
  {path:"dashboard/ubicaciones/recuperar/ubicacion",component:RecuperarUbicacionComponent},
  { path: '**', redirectTo: 'dashboard/home', pathMatch: 'full' }, // Redirección en caso de rutas inválidas
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
