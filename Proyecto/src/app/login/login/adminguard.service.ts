import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AdminguardService implements CanActivate {

  constructor(private router: Router) { }
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      //const permisos = JSON.parse(localStorage.getItem('permisos') || '[]');
      const permiso = Number(localStorage.getItem('permisos'))
      console.log(permiso);

      if (permiso == 1 || permiso == 2) {
        return true;  //Permitir acceso a administradores
      } else {
        this.router.navigate(['/dashboard/acceso_denegado']);  //Redirigir si no tiene permisos
        return false;
      }
      //return true; // Permitir acceso si hay un token
    } else {
      this.router.navigate(['/usuarios/login']); //Redirigir al login si no hay token
      return false;
    }

  }
}
