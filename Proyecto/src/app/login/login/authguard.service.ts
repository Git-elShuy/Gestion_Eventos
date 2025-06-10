import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate{

  constructor(private router: Router) { }
  canActivate(): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true; // Permitir acceso si hay un token
    } else {
      this.router.navigate(['/usuarios/login']); //Redirigir al login si no hay token
      return false;
    }
  }
}
