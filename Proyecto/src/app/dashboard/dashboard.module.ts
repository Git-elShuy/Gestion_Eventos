import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';


@NgModule({
  declarations: [
    DashboardComponent,
    RegistroUsuarioComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }
