import { Component, AfterViewInit, OnInit } from '@angular/core';
import { UsuarioService } from '../usuarios/usuario.service';
import { jwtDecode } from 'jwt-decode';
import { CarreraService } from '../carreras/carrera.service';
import { Carrera } from '../carreras/carrera';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  idcarrera!: number;
  carrera!: Carrera;
  carreraNombre!: String;
  constructor(private userService: UsuarioService, private cs: CarreraService, private cd: ChangeDetectorRef, private router: Router) { }
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
    const token = localStorage.getItem('token');

    if (token) {
      const usuario: any = jwtDecode(token);
      this.getUserCarrera(usuario.sub.matricula)

      //this.cd.detectChanges();
    }

  }

  getUserCarrera(matricula: String) {
    this.userService.getUserCarrera(matricula).subscribe({
      next: (idcarrera) => {
        this.idcarrera = idcarrera;
        console.log("idcarrera: v")
        console.log(this.idcarrera);
        this.cs.getCarreraByid(this.idcarrera).subscribe({
          next: (carrera) => {
            this.carrera = carrera;
            this.carreraNombre = carrera.nombre;
            console.log(carrera);
          }, error: (err) => {
            console.log("error", err);
          },
        });
      }, error: (err) => {
        console.log("err", err);
      },
    });
  }
}
