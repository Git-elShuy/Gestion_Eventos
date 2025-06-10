import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroUsuarioComponent } from './usuarios/registro-usuario/registro-usuario.component';
import { EventosComponent } from './eventos/eventos.component';
import { RegistrarEventoComponent } from './eventos/registrar-evento/registrar-evento.component';
//import { SidebarComponent } from './sidebar/sidebar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UbicacionesComponent } from './ubicaciones/ubicaciones.component';
import { RegistrarUbicacionComponent } from './ubicaciones/registrar-ubicacion/registrar-ubicacion.component';
import { EditarUbicacionComponent } from './ubicaciones/editar-ubicacion/editar-ubicacion.component';
import { RecuperarLugarComponent } from './ubicaciones/recuperar-lugar/recuperar-lugar.component';
import { RecuperarUbicacionComponent } from './ubicaciones/recuperar-ubicacion/recuperar-ubicacion.component';
import { CarrerasComponent } from './carreras/carreras.component';
import { NuevaCarreraComponent } from './carreras/nueva-carrera/nueva-carrera.component';
import { EditarCarreraComponent } from './carreras/editar-carrera/editar-carrera.component';
import { RecuperarCarreraComponent } from './carreras/recuperar-carrera/recuperar-carrera.component';
import { AccesoDenegadoComponent } from './usuarios/acceso-denegado/acceso-denegado.component';
import { GestionUsuariosComponent } from './usuarios/gestion-usuarios/gestion-usuarios.component';
import { EventoDetallesComponent } from './eventos/evento-detalles/evento-detalles.component';
import { RegistrarActividadComponent } from './eventos/evento-detalles/registrar-actividad/registrar-actividad.component';
import { RegistrarRecursoComponent } from './eventos/evento-detalles/registrar-recurso/registrar-recurso.component';
import { PatrociniosComponent } from './eventos/evento-detalles/patrocinios/patrocinios.component';
import { RegistrarPatrocinioComponent } from './eventos/evento-detalles/patrocinios/registrar-patrocinio/registrar-patrocinio.component';
import { EditarPatrocinioComponent } from './eventos/evento-detalles/patrocinios/editar-patrocinio/editar-patrocinio.component';
import { RecuperarPatrocinioComponent } from './eventos/evento-detalles/patrocinios/recuperar-patrocinio/recuperar-patrocinio.component';
import { VerRecursosComponent } from './eventos/evento-detalles/ver-recursos/ver-recursos.component';
import { EditarRecursoComponent } from './eventos/evento-detalles/ver-recursos/editar-recurso/editar-recurso.component';
import { RecursosInactivosComponent } from './eventos/evento-detalles/ver-recursos/recursos-inactivos/recursos-inactivos.component';
import { VerActividadesComponent } from './eventos/evento-detalles/ver-actividades/ver-actividades.component';
import { EditarActividadesComponent } from './eventos/evento-detalles/editar-actividades/editar-actividades.component';



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
    CarrerasComponent,
    NuevaCarreraComponent,
    EditarCarreraComponent,
    RecuperarCarreraComponent,
    AccesoDenegadoComponent,
    GestionUsuariosComponent,
    EventoDetallesComponent,
    RegistrarActividadComponent,
    RegistrarRecursoComponent,
    PatrociniosComponent,
    RegistrarPatrocinioComponent,
    EditarPatrocinioComponent,
    RecuperarPatrocinioComponent,
    VerRecursosComponent,
    EditarRecursoComponent,
    RecursosInactivosComponent,
    VerActividadesComponent,
    EditarActividadesComponent,

  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule

  ]
})
export class DashboardModule { }
