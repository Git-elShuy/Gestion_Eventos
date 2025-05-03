import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UbicacionesService } from '../ubicaciones.service';
import { Ubicacion } from '../ubicacion';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registrar-ubicacion',
  templateUrl: './registrar-ubicacion.component.html',
  styleUrl: './registrar-ubicacion.component.css'
})
export class RegistrarUbicacionComponent implements AfterViewInit {
  ubicacionForm: FormGroup;
  /*ubicacion: Ubicacion = {
   nombre: "",
   direccion: "",
   colonia: "",
   contacto: "",
   lugares: []
 }*/
  constructor(private fb: FormBuilder, private us: UbicacionesService, private router: Router) {
    this.ubicacionForm = this.fb.group({
      //nombre: ['', [Validators.required,Validators.pattern('^(?!\\s*$)[a-zA-Z\\s]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      direccion: ['', [Validators.required, Validators.pattern(/^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ][A-Za-zÁÉÍÓÚÜÑáéíóúüñ0-9\s.,#\-]*$/), Validators.minLength(10), Validators.maxLength(40)]],
      colonia: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z\\s]+$'), Validators.minLength(5), Validators.maxLength(15)]],
      contacto: ['', [Validators.required, Validators.pattern('^\\d+$'), Validators.minLength(10), Validators.maxLength(10)]],
      lugares_ubicacion: this.fb.array([])
    })
  }
  get lugares_ubicacionArray(): FormArray {
    return this.ubicacionForm.get('lugares_ubicacion') as FormArray;
  }
  get lugares(): FormArray {
    return this.lugares_ubicacionArray;
  }
  addLugar(): void {
    const lugar = this.fb.group({
      nombreLugar: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$')]],
      capacidad: ['', [Validators.required]]
    })
    this.lugares_ubicacionArray.push(lugar);
  }
  removeLugar(index: number): void {
    this.lugares_ubicacionArray.removeAt(index);
  }
  enviarFormulario(): void {
    if (this.ubicacionForm.valid) {
      const data: Ubicacion = this.ubicacionForm.value;
      console.log(data);
      this.us.crearUbicacion(data).subscribe({
        next: res => {
          alert('Ubicación creada con éxito');
          this.router.navigate(['/dashboard/ubicaciones']);
        },
        error: err => {
          alert('Fallo al crear ubicacion');

        }
      });
    }

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
