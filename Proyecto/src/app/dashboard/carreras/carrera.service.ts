import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Carrera } from './carrera';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarreraService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:5000/api/carreras';

  nuevaCarrera(data: Carrera): Observable<Carrera> {
    return this.http.post<Carrera>(this.apiUrl, data)

  }
  getCarreras(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(this.apiUrl)

  }
  getCarreraByid(idcarrera: number): Observable<Carrera> {
    return this.http.get<Carrera>(`${this.apiUrl}/get_carrera/${idcarrera}`);
  }
  getCarrerasEliminadas(): Observable<Carrera[]> {
    return this.http.get<Carrera[]>(`${this.apiUrl}/eliminadas`)
  }
  eliminarCarrera(idcarrera: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar_carrera/${idcarrera}`, {});
  }
  recuperarCarrera(idcarrera: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/recuperar_carrera/${idcarrera}`, {});

  }
  actualizarCarrera(idcarrera: number, data: Carrera): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/actualizar/${idcarrera}`, data);
  }

  /*crearUbicacion(data: Ubicacion): Observable<any> {
     return this.http.post<any>(this.apiUrl, data);
   }*/
}
