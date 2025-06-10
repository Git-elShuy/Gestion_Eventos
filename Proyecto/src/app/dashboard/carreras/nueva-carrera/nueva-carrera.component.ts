import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Carrera } from '../carrera';
import { CarreraService } from '../carrera.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-nueva-carrera',
  templateUrl: './nueva-carrera.component.html',
  styleUrl: './nueva-carrera.component.css'
})
export class NuevaCarreraComponent implements AfterViewInit, OnInit {
  carreraForm: FormGroup;
  constructor(private fb: FormBuilder, private cs: CarreraService, private router: Router) {
    this.carreraForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$'), Validators.minLength(10), Validators.maxLength(40)]],
      abreviatura: ['', [Validators.required, Validators.pattern('^(?!\s*$)[a-zA-Z\s-]+$'), Validators.minLength(3), Validators.maxLength(6)]],
      //abreviatura: ['', [Validators.required], Validators.pattern('^(?!\s*$)[a-zA-Z\s-]+$'), Validators.minLength(3), Validators.maxLength(6)],
    });
  }
  enviarFormulario(): void {
    if (this.carreraForm.valid) {
      const data: Carrera = this.carreraForm.value;
      this.cs.nuevaCarrera(data).subscribe({
        next: () => {
          //alert('Carrera creada con éxito');
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
          //location.reload();
        },
        error: (err) => {
          console.log(err)
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
  ngOnInit(): void {
    this.router.events.subscribe(() => {
      Swal.close();
    });
  }

}
