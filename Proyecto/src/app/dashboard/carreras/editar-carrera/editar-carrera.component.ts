import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CarreraService } from '../carrera.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Carrera } from '../carrera';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-editar-carrera',
  templateUrl: './editar-carrera.component.html',
  styleUrl: './editar-carrera.component.css'
})
export class EditarCarreraComponent implements OnInit, AfterViewInit {
  idcarrera!: number
  carreraForm: FormGroup;
  constructor(private cs: CarreraService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.carreraForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$'), Validators.minLength(10), Validators.maxLength(40)]],
      abreviatura: ['', [Validators.required, Validators.pattern('^(?!\s*$)[a-zA-Z\s-]+$'), Validators.minLength(3), Validators.maxLength(6)]],
    });
  }
  ngOnInit(): void {
    // Capturar el ID de la URL
    this.route.params.subscribe(params => {
      this.idcarrera = +params['idcarrera']; // Convierte a número
      console.log('ID de ubicación:', this.idcarrera);
    });
    this.router.events.subscribe(() => {
      Swal.close();
    });
    this.cs.getCarreraByid(this.idcarrera).subscribe({
      next: (carrera: Carrera) => {
        console.log(carrera);
        this.carreraForm.patchValue({
          nombre: carrera.nombre,
          abreviatura: carrera.abreviatura,
        });
        console.log(this.carreraForm.value);
      },
      error: (err) => {
        console.log("error", err);
      }
    });
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

  enviarFormulario(): void {
    if (this.carreraForm.valid) {
      const data: Carrera = this.carreraForm.value;
      this.cs.actualizarCarrera(this.idcarrera, data).subscribe({
        next: () => {
          //alert('Carrera actualizada correctamente');
          Swal.fire({
            title: '¡Operación exitosa!',
            text: 'El proceso se completó correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#28a745'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/dashboard/carreras']);
            }
          });

        },
        error: (err) => {
          console.log("error", err);
        },
      });
    }

  }
}
