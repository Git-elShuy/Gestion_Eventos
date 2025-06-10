import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecursoService } from '../../registrar-recurso/recurso.service';
import 'datatables.net';
import $ from 'jquery';
import Swal
  from 'sweetalert2';
import { PatrocinioService } from '../../patrocinios/patrocinio.service';
@Component({
  selector: 'app-recursos-inactivos',
  templateUrl: './recursos-inactivos.component.html',
  styleUrl: './recursos-inactivos.component.css'
})
export class RecursosInactivosComponent implements AfterViewInit, OnInit {
  idevento!: number;
  patrocinadores: { [key: number]: string } = {};
  constructor(private route: ActivatedRoute, private router: Router, private rs: RecursoService, private patrocinioService: PatrocinioService) { }

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
    this.route.params.subscribe(params => {
      this.idevento = +params['idevento']; // Convierte a número
      console.log('ID de evento:', this.idevento);
    });
    this.router.events.subscribe(() => {
      Swal.close();  // 🔹 Cierra el cuadro de diálogo cuando cambia la ruta
    });
    this.cargarPatrocinadores().then(() => {
      this.initDataTable();  
    });

  }
  /*initDataTable(): void {
    const that = this;
      this.rs.getRecursosInactivos(this.idevento).subscribe({
      next: (data) => {
        console.log(data);
        if ($.fn.DataTable.isDataTable('#miTabla')) {
          $('#miTabla').DataTable().destroy(true); // Destruye la tabla actual
          $('#miTabla').DataTable({
            data: data,
            columns: [
              { data: 'nombre', title: 'Recurso' },
              { data: 'cantidad', title: 'Cantidad' },
              { data: 'tipo', title: "Medicion" },
              {
                data: 'contenido_paquete',
                title: 'C/P',
                render: function (data, type, row) {
                  return data && Number(data) > 0 ? data : ''; // Si es 0, deja vacío
                }
              },

              {
                title: 'Acciones',
                render: function (data: any, type: any, row: any) {

                  return `
              
                 <i role="button" class="fa-solid fa fa-undo editar-btn" data-id="${row.idrecurso}"></i>`;

                },

              },
            ],
            language: {
              lengthMenu: "Mostrar _MENU_ registros por página",
              emptyTable: 'No hay recursos para mostrar.',
              search: "Buscar:",
              info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
              paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
              }
            },
            initComplete: function () {
              $('.dataTables_wrapper').css({
                'font-size': '16px',
                'padding': '10px'
              });

              $('table.dataTable').css({
                //'border': '2px solid #007bff',
                'border-collapse': 'collapse'
              });

              $('table.dataTable td, table.dataTable th').css({
                'text-align': 'center',
                'vertical-align': 'middle',
                'padding': '15px',
                'font-size': '16px'
              });

              $('table.dataTable thead').css({
                'background-color': '#343a40',
                'color': 'white',
                'font-weight': 'bold'
              });

              $('table.dataTable tbody tr:nth-child(even)').css({
                'background-color': '#f2f2f2'
              });

              $('table.dataTable tbody tr:hover').css({
                'background-color': '#dee2e6'
              });

              $('#miTabla').on('click', '.editar-btn', function () {
                const idrecurso = $(this).data('id');
                that.recuperarRecurso(idrecurso);

              });

            },
          });
        }
      }, error: (err) => {
        console.log("error", err);
      },
    });

  }*/
  cargarPatrocinadores(): Promise<void> {
    return new Promise((resolve) => {
      this.patrocinioService.getPatrocinios(this.idevento).subscribe({
        next: (response) => {
          response.forEach((p: { idpatrocinio: number; nombrePatrocinador: string }) => {
            this.patrocinadores[p.idpatrocinio] = p.nombrePatrocinador;
          });
          resolve();
        },
        error: () => {
          console.error("Error al cargar patrocinadores");
          resolve(); // 🔥 Evita que se bloquee si hay error
        }
      });
    });
  }
  initDataTable(): void {
    const that = this;
    this.rs.getRecursosInactivos(this.idevento).subscribe({
      next: (data) => {
        console.log(data);
        if ($.fn.DataTable.isDataTable('#miTabla')) {
          $('#miTabla').DataTable().destroy(true); // Destruye la tabla actual
        }
        $('#miTabla').DataTable({
          data: data,
          autoWidth: false,  // Evita que las columnas tengan un ancho fijo
          columnDefs: [
            { targets: '_all', className: 'dt-center' },  // Centrar el contenido automáticamente
            { targets: [0, 1, 2, 3, 4], width: '20%' }  // Ajustar ancho de columnas específicas
          ],
          columns: [
            { data: 'nombre', title: 'Recurso' },
            { data: 'cantidad', title: 'Cantidad' },

            {
              data: 'es_patrocinado', title: 'Patrocinador',

              render: (data) => {
                if (!data || Number(data) === 0) {
                  return '<i class="fw-bold text-danger">NP</i>';
                }
                return this.patrocinadores[data] || '<span class="text-warning">Cargando...</span>';
              }

            },



            { data: 'tipo', title: "Medicion" },
            {
              data: 'contenido_paquete',
              title: 'C/P',
              render: function (data, type, row) {
                return data && Number(data) > 0 ? data : ''; // Si es 0, deja vacío
              }
            },

            {
              title: 'Acciones',
              render: function (data: any, type: any, row: any) {

                return `
              
                 <i role="button" class="fas fa-undo editar-btn" data-id="${row.idrecurso}"></i>
    


             `;

              },

            },
          ],
          language: {
            lengthMenu: "Mostrar _MENU_ registros por página",
            emptyTable: 'No hay recursos para mostrar.',
            search: "Buscar:",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            paginate: {
              first: "Primero",
              last: "Último",
              next: "Siguiente",
              previous: "Anterior"
            }
          },
          initComplete: function () {

            $('table.dataTable thead').css({
              'background-color': '#343a40',
              'color': 'white',
              'font-weight': 'bold'
            });

            $('table.dataTable tbody tr:nth-child(even)').css({
              'background-color': '#f2f2f2'
            });


            $('#miTabla').on('click', '.editar-btn', function () {
              //const idevento = $(this).data('id');
              Swal.fire({
                title: '¿Recuperar recurso?',
                text: 'Esta acción restaurará el recurso. ¿Estás seguro?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, recuperar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
              }).then((result) => {
                if (result.isConfirmed) {
                  const idrecurso = $(this).data('id');
                  console.log(idrecurso);
                  that.recuperarRecurso(idrecurso);
                }
              });



            });

          }
        });
      }, error: (err) => {
        console.log("error", err);
      },
    });
  }
  GoDatosGenerales(): void {
    this.router.navigate(['dashboard/eventos/detalles', this.idevento]);
  }
  GoPatrocinios(): void {
    this.router.navigate(['dashboard/eventos/patrocinios', this.idevento]);
  }
  GoActividades(): void {
    this.router.navigate(['dashboard/eventos/registrar_actividad/', this.idevento]);
  }
  GoActivos(): void {
    this.router.navigate(['dashboard/eventos/recursos', this.idevento]);
  }
  recuperarRecurso(idrecurso: number): void {
    this.rs.recuperarRecurso(idrecurso).subscribe({
      next: () => {
        //alert("Recurso recuperado con exito.");
        Swal.fire({
          title: '¡Recuperado!',
          text: 'El recurso ha sido restaurado.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745'
        }).then(() => {
          location.reload();
        });


      }, error: (err) => {

        console.log("error", err);
      },
    });
  }
}
