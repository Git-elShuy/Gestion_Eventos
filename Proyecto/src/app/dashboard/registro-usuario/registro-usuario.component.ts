import { AfterViewInit, Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Usuarios } from './usuarios';
@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.css'
})
export class RegistroUsuarioComponent implements AfterViewInit {
  form: FormGroup;
  usuario: Usuarios = {
    matricula: "",
    carrera: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    rol: 0
  }
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({

      matricula: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      carrera: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      telefono: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      //telefono: ['', Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(10)],
      email: ['', [Validators.required, Validators.email]],
      rol: ['', Validators.required]
    })
  }
  submit(): void {
    if (this.form.valid) {

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
