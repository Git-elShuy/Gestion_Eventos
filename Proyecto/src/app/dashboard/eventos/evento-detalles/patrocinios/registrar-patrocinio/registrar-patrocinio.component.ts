import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatrocinioService } from '../patrocinio.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registrar-patrocinio',
  templateUrl: './registrar-patrocinio.component.html',
  styleUrl: './registrar-patrocinio.component.css'
})
export class RegistrarPatrocinioComponent implements AfterViewInit, OnInit {
  patrocinioForm: FormGroup;
  idevento!: number;
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private ps: PatrocinioService, private router: Router) {
    this.patrocinioForm = this.fb.group({
      nombrePatrocinador: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$')]],
      evento_id: ['',]

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
  ngOnInit(): void {

    this.route.params.subscribe(params => {
      // Capturar el ID de la URL
      this.idevento = +params['idevento']; // Convierte a número
      console.log('ID de evento:', this.idevento);
    });
  }
  enviarFormulario(): void {
    if (this.patrocinioForm.valid) {
      console.log("entr valid form");
      this.patrocinioForm.patchValue({
        evento_id: this.idevento
      });

      this.ps.nuevo_patrocinio(this.patrocinioForm.value).subscribe({
        next: () => {
          //alert("Patrocinio creado!");
          Swal.fire({
            title: '¡Guardado!',
            text: 'Los cambios se han guardado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#28a745'
          }).then(() => {
            this.router.navigate(['dashboard/eventos/patrocinios/', this.idevento]);
          });


        },
        error: (err) => {
          console.log("❌ Error al registrar patrocinio:", err);
          const mensajeError = err.error?.error || "Error desconocido en la solicitud";
          Swal.fire({
            title: '¡Atencion!',
            text: mensajeError,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33'
          });
        }
      });
    }
  }


}
