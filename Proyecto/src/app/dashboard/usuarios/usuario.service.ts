import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from './registro-usuario/usuarios';
import { LoginResponse } from '../../login/login-response';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:5000/api/usuarios';
  constructor(private http: HttpClient) { }

  getPermits(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/permisos`);
  }
  getPermitsForAdmin(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/permisos_admin`);
  }

  crearUsuario(data: Usuarios): Observable<Usuarios> {
    return this.http.post<Usuarios>(this.apiUrl, data);
  }
  /*login(data:Usuarios): Observable<Usuarios>{
    return this.http.post<Usuarios>(`${this.apiUrl}/login`,data);
  }*/

  login(data: Usuarios): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data);
  }
  getUserPermits(matricula: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user_permits/${matricula}`);

  }
  getUserCarrera(matricula: String): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/user_carrera/${matricula}`);
  }
  getAdminCarreras(idcarrera: number): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.apiUrl}/admin_carreras/${idcarrera}`);
  }
  getAsistentesCarreras(idcarrera: number): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(`${this.apiUrl}/asistentes_carreras/${idcarrera}`);
  }
  getUsuariosActividad(idactividadevento: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios_actividad/${idactividadevento}`)
  }

}
