import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lugar, Ubicacion } from './ubicacion';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionesService {
  private apiUrl = 'http://localhost:5000/api/ubicaciones';
  constructor(private http: HttpClient) { }

  crearUbicacion(data: Ubicacion): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  getUbicaciones(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(this.apiUrl);
  }
  getUbicacionesEliminadas(): Observable<Ubicacion[]> {
    return this.http.get<Ubicacion[]>(`${this.apiUrl}/eliminadas/`);
  }

  getUbicacion_con_lugares(idUbicacion: number): Observable<Ubicacion> {
    return this.http.get<Ubicacion>(`${this.apiUrl}/editar/${idUbicacion}`);
  }


  getLugaresUbicacionById(idUbicacion: number): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.apiUrl}/lugares_ByidUbicacion/${idUbicacion}`);
  }
  /*getUbicacion_con_lugares(idUbicacion: number): Observable<{ ubicacion: Ubicacion }> {
    return this.http.get<{ ubicacion: Ubicacion }>(`${this.apiUrl}/lugares/${idUbicacion}`);
  }*/
  actualizarUbicacion(idUbicacion: number, data: Ubicacion): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${idUbicacion}`, data);
  }
  getLugaresPorUbicacion(idUbicacion: number): Observable<Lugar[]> {
    return this.http.get<Lugar[]>(`${this.apiUrl}/lugares_eliminados/${idUbicacion}`);
  }
  /*recuperarLugares(requestBody:{lugaresRecuperar: number[]}): Observable<any> {
    const requestBody = { lugaresRecuperar };
    return this.http.put<any>(`${this.apiUrl}/recuperar_lugares`, requestBody);
  }*/
  recuperarLugar(idLugar: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/recuperar_lugar/${idLugar}`, {});
  }
  eliminarUbicacion(idUbicacion: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar_ubicacion/${idUbicacion}`, {});
  }
  recuperarUbicacion(idUbicacion: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/recuperar_ubicacion/${idUbicacion}`, {});

  }

}
