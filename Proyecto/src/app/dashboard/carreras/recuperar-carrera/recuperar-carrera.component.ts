import { AfterViewInit, Component, OnInit } from '@angular/core';
import { CarreraService } from '../carrera.service';
import { Router } from '@angular/router';
import 'datatables.net';
import $ from 'jquery';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-recuperar-carrera',
  templateUrl: './recuperar-carrera.component.html',
  styleUrl: './recuperar-carrera.component.css'
})
export class RecuperarCarreraComponent implements OnInit, AfterViewInit {
  constructor(private cs: CarreraService, private router: Router) {

  }
  ngOnInit(): void {
    this.initDataTable();
    this.router.events.subscribe(() => {
      Swal.close();
    });
  }
  initDataTable(): void {
    const that = this;

    this.cs.getCarrerasEliminadas().subscribe({
      next: (data) => {
        if ($.fn.DataTable.isDataTable('#miTabla')) {
          $('#miTabla').DataTable().destroy(true); // Destruye la tabla si ya existe
        }

        $('#miTabla').DataTable({
          data: data, // Datos obtenidos del backend
          autoWidth: false,  // 🔥 Evita que las columnas tengan un ancho fijo
          columnDefs: [
            { targets: '_all', className: 'dt-center' },  // Centrar el contenido automáticamente
            { targets: [0, 1, 2], width: '33%' }  // 🔹 Ajustar ancho de columnas específicas
          ],
          columns: [
            // { data: 'idcarreras', title: 'ID' },
            { data: 'nombre', title: 'Nombre' },
            { data: 'abreviatura', title: 'Abreviatura' },
            //{ data: 'colonia', title: 'Colonia' },
            //{ data: 'contacto', title: 'Contacto' },
            {
              title: 'Acciones',
              render: function (data: any, type: any, row: any) {
                //return `<button class="btn btn-primary btn-sm editar-btn" data-id="${row.idUbicaciones}">Editar</button>`;
                // return `<a role="button" class="editar-btn" data-id="${row.idUbicaciones}"><i class="lni lni-search"></i></a>`;

                return `<a role="button" class="recuperar-btn" data-id="${row.idcarreras}"><i class="fas fa-undo"></i></a>`;

              },

            },
          ],
          language: {
            emptyTable: 'No hay carreras para mostrar.',
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
            //const filterContainer = $('.dt-search');
            //const btn = $('<i class="lni lni-plus ms-2" role="button"></i>');
            //filterContainer.append(btn);

            $('table.dataTable thead').css({
              'background-color': '#343a40',
              'color': 'white',
              'font-weight': 'bold'
            });

            $('table.dataTable tbody tr:nth-child(even)').css({
              'background-color': '#f2f2f2'
            });


            /* btn.on('click', function () {
 
               that.router.navigate(['/dashboard/carreras/registrar']);
             });*/

            $('#miTabla').on('click', '.recuperar-btn', function () {
              const nombreCarrera = $(this).closest('tr').find('td:first').text();
              Swal.fire({
                title: `¿Estás seguro de que quieres recuperar ${nombreCarrera}?`,
                text: '',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
              }).then((result) => {
                if (result.isConfirmed) {
                  const idcarrera = $(this).data('id');
                  that.recuperarCarrera(idcarrera);
                }
              });



            });


          },
        });
      },
      error: (err) => {
        console.error('Error al cargar los datos:', err);
      },
    });
  }
  recuperarCarrera(idcarrera: number): void {
    this.cs.recuperarCarrera(idcarrera).subscribe({
      next: () => {
        Swal.fire({
          title: '¡Operación exitosa!',
          text: 'El proceso se completó correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#28a745'
        }).then((result) => {
          if (result.isConfirmed) {
            location.reload();
          }
        });

      },
      error: (err) => {
        console.log("error", err);
      },
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
