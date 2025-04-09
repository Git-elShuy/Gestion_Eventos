import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventosComponent } from './eventos/eventos.component';
import { RegistrarEventoComponent } from './eventos/registrar-evento/registrar-evento.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';

const routes: Routes = [
  {path:"dashboard/home", component:DashboardComponent},
  {path:"sidebar", component:SidebarComponent},
  {path:"dashboard/eventos", component:EventosComponent},
  {path:"dashboard/eventos/registrar", component:RegistrarEventoComponent},
  {path:"dashboard/usuarios/registrar", component:RegistroUsuarioComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
