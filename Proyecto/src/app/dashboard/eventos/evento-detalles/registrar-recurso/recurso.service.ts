import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RecursoService {
  private apiUrl = 'http://localhost:5000/api/recursos';
  //private apiUrlEventos = 'http://localhost:5000/api/eventos';
  constructor(private http: HttpClient) { }

  crearRecurso(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data)
  }
  getRecursos(idevento: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${idevento}`);
  }
  getRecursosActividad(idactividadevento: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_recursos_actividad/${idactividadevento}`);
  }
  getRecursoByid(idrecurso: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_recurso/${idrecurso}`);
  }
  getRecursosInactivos(idevento: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/recursos_eliminados/${idevento}`);
  }
  eliminarRecurso_patrocinado(idrecurso: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar_patrocinado/${idrecurso}`);
  }
  eliminarRecurso(idrecurso: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar_recurso/${idrecurso}`);
  }
  recuperarRecurso(idrecurso: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/recuperar_recurso/${idrecurso}`, {});
  }
  editarRecurso(idrecurso: number, idevento: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/editar_recurso/${idrecurso}/${idevento}`, data);
  }
  validarCambioRecurso(idrecurso: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/validar_cambio_recurso/${idrecurso}`);
  }
}
