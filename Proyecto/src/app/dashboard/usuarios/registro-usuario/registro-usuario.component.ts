import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Usuarios } from './usuarios';
import { CarreraService } from '../../carreras/carrera.service';
import { Carrera } from '../../carreras/carrera';
import { UsuarioService } from '../usuario.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.css'
})
export class RegistroUsuarioComponent implements AfterViewInit, OnInit {
  carreras!: Carrera[];
  permisos!: any[];
  permiso!: Number;
  idcarrera!: number;
  form: FormGroup;
  /*usuario: Usuarios = {
    matricula: "",
    carrera: "",
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    rol: 0
  }*/
  constructor(private fb: FormBuilder, private cs: CarreraService, private us: UsuarioService, private route: ActivatedRoute, private router: Router) {
    this.form = this.fb.group({

      matricula: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      nombre: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      apellido: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$'), Validators.minLength(3), Validators.maxLength(20)]],
      celular: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      idpermiso: ['', Validators.required],
      idcarrera: ['', Validators.required],
      //telefono: ['', Validators.required, Validators.pattern('^[0-9]+$'), Validators.minLength(10), Validators.maxLength(10)],
    });
  }
  submit(): void {
    console.log("entro submit");
    if (this.permiso == 2) {
      this.form.patchValue({ idpermiso: 3 });
      this.form.patchValue({ idcarrera: this.idcarrera });
    }
    if (this.form.valid) {
      console.log("entro");
      const data: Usuarios = this.form.value;
      console.log(data);
      this.us.crearUsuario(data).subscribe({
        next: () => {
          // alert('Usuario creado con éxito');
          Swal.fire({
            title: '¡Operación exitosa!',
            text: 'El proceso se completó correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#28a745'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['dashboard/usuarios/gestion_usuarios']);
            }
          });

        },
        error: (err) => {
          console.log("error", err);
        },
      });

    }
  }
  ngOnInit(): void {
    //const permiso = Number(localStorage.getItem('permisos'))
    const token = localStorage.getItem('token');
    if (token) {
      const usuario: any = jwtDecode(token);
      this.permiso = Number(localStorage.getItem('permisos'))
      if (this.permiso == 1) {
        this.getCarreras();
        this.getPermits();
      } else {
        this.getUserCarrera(usuario.sub.matricula);
      }
      this.router.events.subscribe(() => {
        Swal.close();
      });
    }

  }
  getPermits(): void {
    this.us.getPermits().subscribe({
      next: (permits) => {
        this.permisos = permits;
        console.log(this.permisos);
      },
      error: (err) => {
        console.log("error", err);
      }
    });
  }
  getUserCarrera(matricula: String): void {
    this.us.getUserCarrera(matricula).subscribe({
      next: (carrera) => {
        this.idcarrera = carrera;
        console.log(this.idcarrera);
      },
      error: (err) => {
        console.log("error", err);
      },
    });
  }
  getCarreras(): void {
    this.cs.getCarreras().subscribe({
      next: (data) => {
        this.carreras = data;
        console.log(this.carreras);
      },
      error: (err) => {
        console.log("error", err)
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
}
