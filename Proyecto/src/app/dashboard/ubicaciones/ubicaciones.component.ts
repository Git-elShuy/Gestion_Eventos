import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UbicacionesService } from './ubicaciones.service';
import { Router } from '@angular/router';
import 'datatables.net';
import $ from 'jquery';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-ubicaciones',
  templateUrl: './ubicaciones.component.html',
  styleUrl: './ubicaciones.component.css'
})
export class UbicacionesComponent implements AfterViewInit, OnInit {
  permiso!: Number;

  constructor(private us: UbicacionesService, private router: Router) {


  }
  ngOnInit(): void {
    this.permiso = Number(localStorage.getItem('permisos'))
    this.initDataTable();
    this.router.events.subscribe(() => {
      Swal.close();
    });
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
          //responsive: true,
          autoWidth: false,  // 🔥 Evita que las columnas tengan un ancho fijo
          columnDefs: [
            { targets: '_all', className: 'dt-center' },  // Centrar el contenido automáticamente
            { targets: [0, 1, 2, 3, 4], width: '20%' }  // 🔹 Ajustar ancho de columnas específicas
          ],
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
            emptyTable: 'No hay ubicaciones para mostrar.',
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
            const permiso = Number(localStorage.getItem('permisos'))
            const filterContainer = $('.dt-search');
            const btn = $('<i class="lni lni-plus ms-2" role="button"></i>');
            filterContainer.append(btn);
            $('table.dataTable tbody tr:nth-child(even)').css({
              'background-color': '#f2f2f2'
            });
            $('table.dataTable thead').css({
              'background-color': '#343a40',
              'color': 'white',
              'font-weight': 'bold'
            });
            btn.on('click', function () {
              if (permiso == 1 || permiso == 2) {
                that.router.navigate(['/dashboard/ubicaciones/registrar']);
              } else {
                //alert("Usted no tiene permiso para realizar esta accion!");
                Swal.fire({
                  title: 'Permiso requerido',
                  text: 'Parece que no tienes los permisos necesarios para realizar esta acción. Si crees que esto es un error, contacta al administrador.',
                  icon: 'info',  // 🔹 Se cambia "error" por "info" para hacerlo más amigable
                  confirmButtonText: 'Entendido',
                  confirmButtonColor: '#3085d6'
                });
              }

            });
            $('#miTabla').on('click', '.editar-btn', function () {
              if (permiso == 1 || permiso == 2) {
                const idUbicacion = $(this).data('id');
                that.editarUbicacion(idUbicacion);
              } else {
                //alert("Usted no tiene permiso para realizar esta accion!");
                Swal.fire({
                  title: 'Permiso requerido',
                  text: 'Parece que no tienes los permisos necesarios para realizar esta acción. Si crees que esto es un error, contacta al administrador.',
                  icon: 'info',  // 🔹 Se cambia "error" por "info" para hacerlo más amigable
                  confirmButtonText: 'Entendido',
                  confirmButtonColor: '#3085d6'
                });
              }
            });
            $('#miTabla').on('click', '.eliminar-btn', function () {
              //onst permiso = Number(localStorage.getItem('permisos'))
              if (permiso == 2 || permiso == 3) {
                //alert("Usted no tiene permiso para realizar esta accion!");
                Swal.fire({
                  title: 'Permiso requerido',
                  text: 'Parece que no tienes los permisos necesarios para realizar esta acción. Si crees que esto es un error, contacta al administrador.',
                  icon: 'info',  // 🔹 Se cambia "error" por "info" para hacerlo más amigable
                  confirmButtonText: 'Entendido',
                  confirmButtonColor: '#3085d6'
                });
              } else {
                const nombreLugar = $(this).closest('tr').find('td:first').text();
                Swal.fire({
                  title: `¿Eliminar ${nombreLugar}?`,
                  text: '',
                  icon: 'warning',
                  showCancelButton: true,
                  confirmButtonText: 'Sí, continuar',
                  cancelButtonText: 'Cancelar',
                  confirmButtonColor: '#3085d6',
                  cancelButtonColor: '#d33'
                }).then((result) => {
                  if (result.isConfirmed) {
                    const idUbicacion = $(this).data('id');
                    that.eliminarUbicacion(idUbicacion);

                  } else {
                    console.log("suario canceló la acción.");
                  }
                });

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
        Swal.fire({
          title: '¡Operación exitosa!',
          text: 'El proceso se completó correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745'
        }).then((result) => {
          if (result.isConfirmed) {

            location.reload()
          }
        });
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
