import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UbicacionesService } from '../ubicaciones.service';
import { Router } from '@angular/router';
import { Ubicacion } from '../ubicacion';
import 'datatables.net';
import $ from 'jquery';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-recuperar-ubicacion',
  templateUrl: './recuperar-ubicacion.component.html',
  styleUrl: './recuperar-ubicacion.component.css'
})
export class RecuperarUbicacionComponent implements OnInit, AfterViewInit {
  ubicaciones: Ubicacion[] = [];
  constructor(private us: UbicacionesService, private router: Router) {

  }
  ngOnInit(): void {
    this.initDataTable();
    this.router.events.subscribe(() => {
      Swal.close();  // 🔹 Cierra el cuadro de diálogo cuando cambia la ruta
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
  recuperarUbicacion(idUbicacion: number): void {
    this.us.recuperarUbicacion(idUbicacion).subscribe({
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
        console.log("Error recuperando ubicacion", err)
      },
    })
  }
  initDataTable(): void {
    const that = this;

    this.us.getUbicacionesEliminadas().subscribe({
      next: (data) => {
        console.log(data);
        this.ubicaciones = data;
        if ($.fn.DataTable.isDataTable('#miTabla')) {
          $('#miTabla').DataTable().destroy(true); // Destruye la tabla si ya existe
        }

        $('#miTabla').DataTable({
          data: data, // Datos obtenidos del backend
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
                //return `<a role="button" class="editar-btn" data-id="${row.idUbicaciones}"><i class="lni lni-search"></i></a>`
                return `<a role="button" class="recuperar-btn" data-id="${row.idUbicaciones}"><i class="fas fa-undo"></i></a>`;

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
            const filterContainer = $('.dt-search');
            const btn = $('<i class="lni lni-plus ms-2" role="button"></i>');
            filterContainer.append(btn);

            $('table.dataTable thead').css({
              'background-color': '#343a40',
              'color': 'white',
              'font-weight': 'bold'
            });

            $('table.dataTable tbody tr:nth-child(even)').css({
              'background-color': '#f2f2f2'
            });

            btn.on('click', function () {

              that.router.navigate(['/dashboard/ubicaciones/registrar']);
            });
            $('#miTabla').on('click', '.recuperar-btn', function () {
              const nombreLugar = $(this).closest('tr').find('td:first').text();
              Swal.fire({
                title: `¿Estás seguro de que quieres recuperar ${nombreLugar}?`,
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
                  that.recuperarUbicacion(idUbicacion);
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
}
