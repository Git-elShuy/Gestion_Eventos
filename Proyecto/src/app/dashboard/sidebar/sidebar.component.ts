import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit, AfterViewInit {
  permiso !: number;
  constructor(private router: Router, private cd: ChangeDetectorRef) { }
  logout(): void {
    Swal.fire({
      title: `¿Cerrar Sesión?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.clear();
        this.router.navigate(['/usuarios/login']);
      }
    });



  }
  ngOnInit(): void {

  }
  ngAfterViewInit(): void {
    this.permiso = Number(localStorage.getItem('permisos'))
    console.log("sidebar", this.permiso);
    this.cd.detectChanges();
  }
}
