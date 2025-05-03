import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UbicacionesService } from './ubicaciones.service';
import { Router } from '@angular/router';
import 'datatables.net';
import $ from 'jquery';
@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrl: './ubicaciones.component.css'
})
export class UbicacionesComponent implements AfterViewInit, OnInit {


  constructor(private us: UbicacionesService, private router: Router) {


  }
  ngOnInit(): void {
    this.initDataTable();
  }

  initDataTable(): void {
    const that = this;

    this.us.getUbicaciones().subscribe({
      next: (data) => {
        if ($.fn.DataTable.isDataTable('#miTabla')) {
          $('#miTabla').DataTable().destroy(true); // Destruye la tabla si ya existe
        }

        $('#miTabla').DataTable({
          data: data, // Datos obtenidos del backend
          columns: [
            // { data: 'idUbicaciones', title: 'ID' },
            { data: 'nombre', title: 'Nombre' },
            { data: 'direccion', title: 'Dirección' },
            { data: 'colonia', title: 'Colonia' },
            { data: 'contacto', title: 'Contacto' },
            {
              title: 'Acciones',
              render: function (data: any, type: any, row: any) {
                //return `<button class="btn btn-primary btn-sm editar-btn" data-id="${row.idUbicaciones}">Editar</button>`;
                // return `<a role="button" class="editar-btn" data-id="${row.idUbicaciones}"><i class="lni lni-search"></i></a>`;
                return `
              
                 <i role="button" class="fa-solid fa-magnifying-glass editar-btn" data-id="${row.idUbicaciones}"></i>
    
                 <i role="button" class="fa-solid fa-trash eliminar-btn" data-id="${row.idUbicaciones}" style="margin-left: 10px; color:red;"></i>

             `;

              },

            },
          ],
          language: {
            emptyTable:'No hay ubicaciones para mostrar.',
            lengthMenu: 'Mostrar _MENU_ registros por página',
            search: 'Buscar:',
            info: 'Mostrando _START_ a _END_ de _TOTAL_ registros',
            paginate: {
              first: 'Primero',
              last: 'Último',
              next: 'Siguiente',
              previous: 'Anterior',
            },
          },
          initComplete: function () {
            const filterContainer = $('.dt-search');
            const btn = $('<i class="lni lni-plus ms-2" role="button"></i>');
            filterContainer.append(btn);
            btn.on('click', function () {

              that.router.navigate(['/dashboard/ubicaciones/registrar']);
            });
            $('#miTabla').on('click', '.editar-btn', function () {
              const idUbicacion = $(this).data('id');
              that.editarUbicacion(idUbicacion);
            });
            $('#miTabla').on('click', '.eliminar-btn', function () {
              const nombreLugar = $(this).closest('tr').find('td:first').text();
              const confirmar = window.confirm(`¿Estás seguro de que quieres eliminar "${nombreLugar}"?`);
              if (confirmar) {
                const idUbicacion = $(this).data('id');
                that.eliminarUbicacion(idUbicacion);
              }

            });

          },
        });
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      },
    });
  }

  editarUbicacion(idUbicacion: number): void {
    console.log(`Editar ubicación con ID: ${idUbicacion}`);
    //console.log("id: " + idUbicacion)
    this.router.navigate(['/dashboard/ubicaciones/editar', idUbicacion]);
  }
  eliminarUbicacion(idUbicacion: number): void {
    this.us.eliminarUbicacion(idUbicacion).subscribe({
      next: () => {
       location.reload();
      },
      error: (err) => {
        console.log("error al eliminar", err)
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
