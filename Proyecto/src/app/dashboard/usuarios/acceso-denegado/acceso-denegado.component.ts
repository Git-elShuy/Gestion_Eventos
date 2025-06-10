import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-acceso-denegado',
  templateUrl: './acceso-denegado.component.html',
  styleUrl: './acceso-denegado.component.css'
})
export class AccesoDenegadoComponent {
  constructor(private router: Router){}
  volverAlInicio(): void {
    this.router.navigate(['/dashboard/home']);
  }
}
