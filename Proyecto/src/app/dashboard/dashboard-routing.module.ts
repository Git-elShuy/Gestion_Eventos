import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { EventosComponent } from './eventos/eventos.component';
import { RegistrarEventoComponent } from './eventos/registrar-evento/registrar-evento.component';
//import { SidebarComponent } from './sidebar/sidebar.component';
import { RegistroUsuarioComponent } from './usuarios/registro-usuario/registro-usuario.component';
import { UbicacionesComponent } from './ubicaciones/ubicaciones.component';
import { RegistrarUbicacionComponent } from './ubicaciones/registrar-ubicacion/registrar-ubicacion.component';
import { EditarUbicacionComponent } from './ubicaciones/editar-ubicacion/editar-ubicacion.component';
import { RecuperarLugarComponent } from './ubicaciones/recuperar-lugar/recuperar-lugar.component';
import { RecuperarUbicacionComponent } from './ubicaciones/recuperar-ubicacion/recuperar-ubicacion.component';
import { NuevaCarreraComponent } from './carreras/nueva-carrera/nueva-carrera.component';
import { CarrerasComponent } from './carreras/carreras.component';
import { RecuperarCarreraComponent } from './carreras/recuperar-carrera/recuperar-carrera.component';
import { EditarCarreraComponent } from './carreras/editar-carrera/editar-carrera.component';
import { AdminguardService } from '../login/login/adminguard.service';
import { SaadminguardService } from '../login/login/saadminguard.service';
import { AuthguardService } from '../login/login/authguard.service';
import { AccesoDenegadoComponent } from './usuarios/acceso-denegado/acceso-denegado.component';
import { GestionUsuariosComponent } from './usuarios/gestion-usuarios/gestion-usuarios.component';
import { EventoDetallesComponent } from './eventos/evento-detalles/evento-detalles.component';
import { RegistrarActividadComponent } from './eventos/evento-detalles/registrar-actividad/registrar-actividad.component';
import { RegistrarRecursoComponent } from './eventos/evento-detalles/registrar-recurso/registrar-recurso.component';
import { RegistrarPatrocinioComponent } from './eventos/evento-detalles/patrocinios/registrar-patrocinio/registrar-patrocinio.component';
import { PatrociniosComponent } from './eventos/evento-detalles/patrocinios/patrocinios.component';
import { EditarPatrocinioComponent } from './eventos/evento-detalles/patrocinios/editar-patrocinio/editar-patrocinio.component';
import { RecuperarPatrocinioComponent } from './eventos/evento-detalles/patrocinios/recuperar-patrocinio/recuperar-patrocinio.component';
import { VerRecursosComponent } from './eventos/evento-detalles/ver-recursos/ver-recursos.component';
import { RecursosInactivosComponent } from './eventos/evento-detalles/ver-recursos/recursos-inactivos/recursos-inactivos.component';
import { EditarRecursoComponent } from './eventos/evento-detalles/ver-recursos/editar-recurso/editar-recurso.component';
import { VerActividadesComponent } from './eventos/evento-detalles/ver-actividades/ver-actividades.component';
import { EditarActividadesComponent } from './eventos/evento-detalles/editar-actividades/editar-actividades.component';


const routes: Routes = [
  { path: "dashboard/home", component: DashboardComponent, canActivate: [AuthguardService] },
  //{path:"sidebar", component:SidebarComponent},
  { path: "dashboard/eventos", component: EventosComponent, canActivate: [AuthguardService] },
  { path: "dashboard/eventos/recursos/:idevento", component: VerRecursosComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/actividades/:idevento", component: VerActividadesComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/editar_actividad/:idevento/:idactividadevento", component: EditarActividadesComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/recursos/eliminados/:idevento", component: RecursosInactivosComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/patrocinios/:idevento", component: PatrociniosComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/patrocinios/eliminados/:idevento", component: RecuperarPatrocinioComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/registrar_patrocinio/:idevento", component: RegistrarPatrocinioComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/editar_patrocinio/:idpatrocinio/:idevento", component: EditarPatrocinioComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/editar_recurso/:idrecurso/:idevento", component: EditarRecursoComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/registrar", component: RegistrarEventoComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/registrar_actividad/:idevento", component: RegistrarActividadComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/registrar_recurso/:idevento", component: RegistrarRecursoComponent, canActivate: [AdminguardService] },
  { path: "dashboard/eventos/detalles/:idevento", component: EventoDetallesComponent, canActivate: [AuthguardService] },
  { path: "dashboard/usuarios/registrar", component: RegistroUsuarioComponent, canActivate: [AdminguardService] },
  { path: "dashboard/ubicaciones", component: UbicacionesComponent, canActivate: [AuthguardService] },
  { path: "dashboard/ubicaciones/registrar", component: RegistrarUbicacionComponent, canActivate: [AdminguardService] },
  { path: "dashboard/ubicaciones/editar/:idUbicacion", component: EditarUbicacionComponent, canActivate: [AdminguardService] },
  { path: "dashboard/ubicaciones/editar/recuperar/lugares/:idUbicacion", component: RecuperarLugarComponent, canActivate: [AdminguardService] },
  { path: "dashboard/ubicaciones/recuperar/ubicacion", component: RecuperarUbicacionComponent, canActivate: [SaadminguardService] },
  { path: "dashboard/carreras", component: CarrerasComponent, canActivate: [SaadminguardService] },
  { path: "dashboard/carreras/registrar", component: NuevaCarreraComponent, canActivate: [SaadminguardService] },
  { path: "dashboard/carreras/recuperar", component: RecuperarCarreraComponent, canActivate: [SaadminguardService] },
  { path: "dashboard/carreras/editar/:idcarrera", component: EditarCarreraComponent, canActivate: [SaadminguardService] },
  { path: "dashboard/acceso_denegado", component: AccesoDenegadoComponent, canActivate: [AuthguardService] },
  { path: "dashboard/usuarios/gestion_usuarios", component: GestionUsuariosComponent, canActivate: [AdminguardService] },
  { path: '**', redirectTo: 'dashboard/home', pathMatch: 'full' }, // Redirección en caso de rutas inválidas
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
