export interface Ubicacion {
    idUbicaciones:number;
    nombre: string;
    direccion: string;
    colonia: string;
    contacto: string;
    lugares: Lugar[];
}
export interface Lugar {
    nombreLugar: string;
    capacidad: number;
    //idubicaciones_lugar: number;
    idubicaciones_lugar?: number;  // Opcional, porque los nuevos no tienen ID
    eliminar : number;
}