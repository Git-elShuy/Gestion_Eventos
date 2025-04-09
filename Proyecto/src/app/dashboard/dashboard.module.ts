import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { EventosComponent } from './eventos/eventos.component';
import { RegistrarEventoComponent } from './eventos/registrar-evento/registrar-evento.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    DashboardComponent,
    RegistroUsuarioComponent,
    EventosComponent,
    RegistrarEventoComponent,
    SidebarComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class DashboardModule { }
