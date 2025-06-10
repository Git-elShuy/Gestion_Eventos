import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PatrocinioService {
  private apiUrl = 'http://localhost:5000/api/patrocinios';
  private token = localStorage.getItem('token');
  constructor(private http: HttpClient) { }

  nuevo_patrocinio(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
  getPatrocinios(idevento: number): Observable<any> {
    //console.log("Token JWT enviado:", this.token);
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`, //agregamos el jwt
      'Content-Type': 'application/json'
    });
    return this.http.get<any>(`${this.apiUrl}/${idevento}`, { headers });

  }
  getPatrociniosEliminados(idevento: number): Observable<any> {
    //return this.http.get<any>(`${this.apiUrl}/${idevento}`);
    return this.http.get<any>(`${this.apiUrl}/eliminados/${idevento}`);

  }
  eliminarPatrocinio(idpatrocinio: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/eliminar_patrocinio/${idpatrocinio}`, {})
  }
  recuperarPatrocinio(idpatrocinio: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/recuperar_patrocinio/${idpatrocinio}`, {})
  }
  getPatrocinioById(idpatrocinio: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patrocinio_Byid/${idpatrocinio}`);
  }
  editarPatrocinio(idpatrocinio: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/editar_patrocinio/${idpatrocinio}`, data)
  }
  validar_cambioPatrocinio(idpatrocinio: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/validar_cambio_patrocinio/${idpatrocinio}`)
  }
  get_nombrePatrocinador(idpatrocinio: number): Observable<any> {
    console.log("🔍 Consultando patrocinador con ID:", idpatrocinio);
    return this.http.get<{ nombrePatrocinador: string }>(`${this.apiUrl}/nombre_patrocinador/${idpatrocinio}`);
  }
}
