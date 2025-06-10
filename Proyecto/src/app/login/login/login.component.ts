import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from '../../dashboard/usuarios/usuario.service';
import { Usuarios } from '../../dashboard/usuarios/registro-usuario/usuarios';
import { LoginResponse } from '../login-response';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  constructor(private fb: FormBuilder, private us: UsuarioService, private router: Router) {
    this.form = this.fb.group({
      matricula: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }
  ngOnInit(): void {
    /*this.router.events.subscribe(() => {
      Swal.close();
    });*/
  }
  submit(): void {
    if (this.form.valid) {
      const data: Usuarios = this.form.value;
      console.log(data);

      this.us.login(data).subscribe({
        next: (response: LoginResponse) => {
          // Guardar el token primero
          localStorage.setItem('token', response.token);

          // Decodificar el token para obtener datos del usuario
          const usuario: any = jwtDecode(response.token);
          console.log('Usuario decodificado:', usuario);
          console.log('Matrícula obtenida:', usuario.sub.matricula);

          // Obtener permisos ANTES de la navegación
          this.us.getUserPermits(usuario.sub.matricula).subscribe({
            next: (permiso) => {
              console.log(permiso);
              localStorage.setItem('permisos', JSON.stringify(permiso));
              

              Swal.fire({
                icon: "success",
                title: "Iniciaste sesión.",
                showConfirmButton: false,
                timer: 4000,
                toast: true,
                position: "top-end"
              });

              //Realizar la navegación DESPUÉS de que los permisos han sido guardados
              this.router.navigate(['/dashboard/home']);
            },
            error: (err) => {
              console.log("Error al obtener permisos", err);
            },
          });
        },
        error: (err) => {
          Swal.fire({
            title: 'Error de autenticación',
            text: 'Usuario o contraseña incorrectos.',
            icon: 'error',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#d33'
          });

          console.log("Error en login", err);
        },
      });
    }
  }

}
