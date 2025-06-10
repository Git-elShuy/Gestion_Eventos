import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RecursoService } from '../registrar-recurso/recurso.service';
import 'datatables.net';
import $ from 'jquery';
import Swal from 'sweetalert2';
import { PatrocinioService } from '../patrocinios/patrocinio.service';
@Component({
  selector: 'app-ver-recursos',
  templateUrl: './ver-recursos.component.html',
  styleUrl: './ver-recursos.component.css'
})
export class VerRecursosComponent implements AfterViewInit, OnInit {
  idevento!: number;
  patrocinadores_db!: any[];
  patrocinadores: { [key: number]: string } = {};
  constructor(private route: ActivatedRoute, private router: Router, private rs: RecursoService, private patrociniosService: PatrocinioService) { }
  GoInactivos(): void {
    this.router.navigate(['dashboard/eventos/recursos/eliminados/', this.idevento])
  }
  /*cargarPatrocinadores(): void {
    this.patrociniosService.getPatrocinios(this.idevento).subscribe({
      next: (data) => {
        this.patrocinadores_db = data;
        console.log("PATROCINAODRES", this.patrocinadores_db);
        this.patrocinadores_db.forEach(p => {
          this.patrocinadores[p.idpatrocinio] = p.nombrePatrocinador;
        });
      }, error: (err) => {

      }
    });
  }*/
  cargarPatrocinadores(): Promise<void> {
    return new Promise((resolve) => {
      this.patrociniosService.getPatrocinios(this.idevento).subscribe({
        next: (response) => {
          response.forEach((p: { idpatrocinio: number; nombrePatrocinador: string }) => {
            this.patrocinadores[p.idpatrocinio] = p.nombrePatrocinador;
          });
          resolve();
        },
        error: () => {
          console.error("Error al cargar patrocinadores");
          resolve(); // Evita que se bloquee si hay error
        }
      });
    });
  }
  initDataTable(): void {

    const that = this;
    this.rs.getRecursos(this.idevento).subscribe({
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
              
                 <i role="button" class="fa-solid fa-magnifying-glass editar-btn" data-id="${row.idrecurso}"></i>
    
                 <i role="button" class="fa-solid fa-trash eliminar-btn" data-id="${row.idrecurso}" style="margin-left: 10px; color:red;"></i>

             `;

              },

            },
          ],
          language: {
            lengthMenu: "Mostrar _MENU_ registros por página",
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
            // Encuentra el contenedor del filtro y agrega el botón
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
              //alert("boton click");
              that.router.navigate(['dashboard/eventos/registrar_recurso/', that.idevento]);

            });
            $('#miTabla').on('click', '.editar-btn', function () {
              //const idevento = $(this).data('id');
              //that.router.navigate(['dashboard/eventos/detalles', idevento]);
              let data = $('#miTabla').DataTable().row($(this).parents('tr')).data();
              if (data.patrocinio_id && Number(data.patrocinio_id) > 0) {
                //si es un patrocinio
                //window.location.href =`dashboard/eventos/editar_patrocinio/${data.patrocinio_id}?origen=recursos`;
                window.location.href = `/dashboard/eventos/editar_patrocinio/${data.patrocinio_id}/${data.evento_id}?origen=recursos`;

              } else {
                that.editarRecurso(data.idrecurso)
              }

            });
            $('#miTabla').on('click', '.eliminar-btn', function () {
              Swal.fire({
                title: '¿Estás seguro?',
                text: 'Los recursos eliminados se mostraran en la pestaña de Inactivos.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
              }).then((result) => {
                if (result.isConfirmed) {
                  console.log(" Usuario confirmó la acción.");
                  //  llamar método o ejecutar la acción deseada
                  let data = $('#miTabla').DataTable().row($(this).parents('tr')).data();
                  if (data.patrocinio_id && Number(data.patrocinio_id) > 0) {
                    // si es un recurso patrocinado eliminar el registro ya que tenemos esa data en la tabla de patrocinios.
                    that.elimnarPatrocinio(data.idrecurso);

                  } else {
                    that.eliminarRecurso(data.idrecurso);
                  }
                } else {
                  console.log(" Usuario canceló la acción.");
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
  elimnarPatrocinio(idrecurso: number): void {
    this.rs.eliminarRecurso_patrocinado(idrecurso).subscribe({
      next: () => {
        //alert("Recurso eliminado correctamente.");
        Swal.fire({
          title: '¡Guardado!',
          text: 'Los cambios se han guardado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745'
        }).then(() => {
          location.reload()
        });


      }, error: (err) => {
        console.log("error", err);
      },
    });
  }
  eliminarRecurso(idrecurso: number): void {
    this.rs.eliminarRecurso(idrecurso).subscribe({
      next: () => {
        //alert("Recurso eliminado correctamente.");
        Swal.fire({
          title: '¡Guardado!',
          text: 'Los cambios se han guardado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745'
        }).then(() => {
          location.reload()
        });

      }, error: (err) => {
        console.log("error", err);
      },
    });
  }
  editarRecurso(idrecurso: number): void {

    this.router.navigate(['dashboard/eventos/editar_recurso/', idrecurso, this.idevento])
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
  ngOnInit(): void {
    // Capturar el ID de la URL
    this.route.params.subscribe(params => {
      this.idevento = +params['idevento']; // Convierte a número
      console.log('ID de evento:', this.idevento);

    });

    this.router.events.subscribe(() => {
      Swal.close();  // 🔹 Cierra el cuadro de diálogo cuando cambia la ruta
    });


    this.cargarPatrocinadores().then(() => {
      this.initDataTable();  // Solo se inicializa DataTables cuando patrocinios está listo
    });
  }

  GoDatosGenerales(): void {
    this.router.navigate(['dashboard/eventos/detalles', this.idevento]);
  }
  GoPatrocinios(): void {
    this.router.navigate(['dashboard/eventos/patrocinios', this.idevento]);
  }
  GoActividades(): void {
    this.router.navigate(['dashboard/eventos/actividades/', this.idevento]);
  }

}
