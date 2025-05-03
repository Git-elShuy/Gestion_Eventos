import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UbicacionesService } from '../ubicaciones.service';
import { Ubicacion } from '../ubicacion';
@Component({
  selector: 'app-editar-ubicacion',
  templateUrl: './editar-ubicacion.component.html',
  styleUrl: './editar-ubicacion.component.css'
})
export class EditarUbicacionComponent implements OnInit , AfterViewInit{
  idUbicacion!: number;
  ubicacionForm: FormGroup;
  lugaresEliminados: number[] = [];
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router, private us: UbicacionesService) {
    this.ubicacionForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,#\-]*$/), Validators.minLength(10), Validators.maxLength(40)]],
      colonia: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z\\s]+$'), Validators.minLength(5), Validators.maxLength(15)]],
      contacto: ['', [Validators.required, Validators.pattern('^\\d+$'), Validators.minLength(10), Validators.maxLength(10)]],
      lugares_ubicacion: this.fb.array([])
    });
  }
  get lugares_ubicacionArray(): FormArray {
    return this.ubicacionForm.get('lugares_ubicacion') as FormArray;
  }
  cargarUbicacion(idUbicacion: number): void {

    /*this.us.getUbicacion_con_lugares(idUbicacion).subscribe({
      next: (data: { ubicacion: Ubicacion }) => { // Cambia la estructura de los datos
        console.log('Datos completos recibidos:', data);
        console.log('Ubicación recibida:', data.ubicacion);
        console.log('Lugares recibidos:', data.ubicacion.lugares);
    
        this.ubicacionForm.patchValue({
          nombre: data.ubicacion.nombre,
          direccion: data.ubicacion.direccion,
          colonia: data.ubicacion.colonia,
          contacto: data.ubicacion.contacto,
        });
    
        // Acceder correctamente a "lugares"
        if (data.ubicacion.lugares && Array.isArray(data.ubicacion.lugares)) {
          data.ubicacion.lugares.forEach((lugar) => {
            const lugarForm = this.fb.group({
              nombreLugar: [lugar.nombreLugar, [Validators.required]],
              capacidad: [lugar.capacidad, [Validators.required]],
            });
            this.lugares_ubicacionArray.push(lugarForm);
          });
        } else {
          console.warn("La propiedad 'lugares' está ausente o no es un array.");
        }
      },
      error: (err) => {
        console.error("Error al obtener la ubicación:", err);
      }
    });*/

    this.us.getUbicacion_con_lugares(idUbicacion).subscribe({
      next: (ubicacion: Ubicacion) => {
        console.log('Ubicación recibida:', ubicacion); // Depuración
        console.log('Lugares recibidos:', ubicacion.lugares);
        this.ubicacionForm.patchValue({
          nombre: ubicacion.nombre,
          direccion: ubicacion.direccion,
          colonia: ubicacion.colonia,
          contacto: ubicacion.contacto,
        });

        if (ubicacion.lugares && Array.isArray(ubicacion.lugares)) {
          ubicacion.lugares.forEach((lugar) => {
            const lugarForm = this.fb.group({
              idubicaciones_lugar: [lugar.idubicaciones_lugar],
              eliminar: [lugar.eliminar],
              nombreLugar: [lugar.nombreLugar, [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$')]],
              capacidad: [lugar.capacidad, [Validators.required]]
            });
            this.lugares_ubicacionArray.push(lugarForm);
            console.log(lugarForm.value);
          });
        } else {
          console.warn('La propiedad lugares es undefined o no es un array.');
        }
      }
      ,
      error: (err) => {
        console.error('Error al obtener ubicación:', err);
      }
    });
  }
  addLugar(): void {
    const lugar = this.fb.group({
      eliminar: [0],
      nombreLugar: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$')]],
      capacidad: ['', [Validators.required]]
    })
    this.lugares_ubicacionArray.push(lugar);
    console.log(lugar.value);
  }
  removeLugar(index: number): void {
    const lugar = this.lugares_ubicacionArray.at(index);
    const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar "${lugar.value.nombreLugar}"?`);

    if (confirmar) {
      if (lugar.value.idubicaciones_lugar) { // Si el lugar ya existe en la BD
        this.lugaresEliminados.push(lugar.value.idubicaciones_lugar);
      }

      this.lugares_ubicacionArray.removeAt(index); // Remover de la UI
    } else {
      console.log("El usuario canceló la eliminación");
    }
  }

  enviarFormulario(): void {
    if (this.ubicacionForm.valid) {
      const data: Ubicacion = this.ubicacionForm.value;
      //console.log(this.ubicacionForm.value);
      console.log(data);
      const requestBody = { ...data, lugaresEliminados: this.lugaresEliminados };
      console.log("Lugares eliminados a enviar:", this.lugaresEliminados);

      this.us.actualizarUbicacion(this.idUbicacion, requestBody).subscribe({
        next: () => {
          alert('Ubicación actualizada correctamente');
          this.router.navigate(['/dashboard/ubicaciones']);
          //location.reload();
        },
        error: (err) => {
          console.error('Error al actualizar ubicación:', err);
        }
      });
    }

  }
  recuperarLugares(){
    this.router.navigate(['/dashboard/ubicaciones/editar/recuperar/lugares',this.idUbicacion]);
  }
  ngOnInit(): void {
    // Capturar el ID de la URL
    this.route.params.subscribe(params => {
      this.idUbicacion = +params['idUbicacion']; // Convierte a número
      console.log('ID de ubicación:', this.idUbicacion);
    });
    this.cargarUbicacion(this.idUbicacion);
    //console.log(this.ubicacionForm.value);
  }
  ngAfterViewInit(): void {
    const toggler = document.querySelector(".toggler-btn");

    if (toggler) { // Validar si toggler existe antes de usarlo
      toggler.addEventListener("click", () => {
        const sidebar = document.querySelector("#sidebar");
        if (sidebar) {
          sidebar.classList.toggle("collapsed");
        }
      });
    } else {
      console.error("Elemento '.toggler-btn' no encontrado en el DOM.");
    }
  }


}
