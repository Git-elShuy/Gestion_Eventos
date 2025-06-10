import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SaadminguardService implements CanActivate {

  constructor(private router: Router) { }
  canActivate(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const permiso = Number(localStorage.getItem('permisos'))
      if (permiso == 1) {
        return true;  //Permitir acceso a super administradores
      } else {
        this.router.navigate(['/dashboard/acceso_denegado']);
        return false;
      }
    } else {
      this.router.navigate(['/usuarios/login']);
      return false;
    }




  }
}
