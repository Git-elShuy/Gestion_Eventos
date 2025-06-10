import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from './evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(private http: HttpClient) { }
  private apiUrl = 'http://localhost:5000/api/eventos';

  nuevoEvento(data: Evento): Observable<Evento> {
    return this.http.post<Evento>(this.apiUrl, data);
  }
  getEventosByCarrera(idcarrera: number): Observable<Evento[]> {
    //console.log("idcarrera v")
    //console.log(idcarrera);
    return this.http.get<Evento[]>(`${this.apiUrl}/eventos_carrera/${idcarrera}`);

  }
  getEventoById(idevento: number): Observable<Evento> {
    return this.http.get<Evento>(`${this.apiUrl}/evento_ById/${idevento}`);
  }
  ActualizarEvento(idevento: number, data: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apiUrl}/actualizar/${idevento}`, data);

  }
  getUbicacionByeventoId(idevento: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getUbicacion_byEventoId/${idevento}`);
  }
  getTipoActividades(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_tipo_actividades`);
  }
  getFechasEvento(idevento: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_Fechas/${idevento}`);
  }
  addActividad(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add_actividad`, data);
  }
  getActividades(idevento:number):Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get_actividades/${idevento}`);
  }
}
