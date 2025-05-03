import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';
import { EventosComponent } from './eventos/eventos.component';
import { RegistrarEventoComponent } from './eventos/registrar-evento/registrar-evento.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UbicacionesComponent } from './ubicaciones/ubicaciones.component';
import { RegistrarUbicacionComponent } from './ubicaciones/registrar-ubicacion/registrar-ubicacion.component';
import { EditarUbicacionComponent } from './ubicaciones/editar-ubicacion/editar-ubicacion.component';
import { RecuperarLugarComponent } from './ubicaciones/recuperar-lugar/recuperar-lugar.component';
import { RecuperarUbicacionComponent } from './ubicaciones/recuperar-ubicacion/recuperar-ubicacion.component';
import { CarrerasComponent } from './carreras/carreras.component';


@NgModule({
  declarations: [
    DashboardComponent,
    RegistroUsuarioComponent,
    EventosComponent,
    RegistrarEventoComponent,
    SidebarComponent,
    UbicacionesComponent,
    RegistrarUbicacionComponent,
    EditarUbicacionComponent,
    RecuperarLugarComponent,
    RecuperarUbicacionComponent,
    CarrerasComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class DashboardModule { }
