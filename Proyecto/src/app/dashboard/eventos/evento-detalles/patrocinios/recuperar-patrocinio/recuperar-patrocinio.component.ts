import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PatrocinioService } from '../patrocinio.service';
import { ActivatedRoute, Router } from '@angular/router';
import 'datatables.net';
import $, { error } from 'jquery';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-recuperar-patrocinio',
  templateUrl: './recuperar-patrocinio.component.html',
  styleUrl: './recuperar-patrocinio.component.css'
})
export class RecuperarPatrocinioComponent implements AfterViewInit, OnInit {
  idevento!: number;
  constructor(private ps: PatrocinioService, private route: ActivatedRoute, private router: Router) { }
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
      // Capturar el ID de la URL
      this.idevento = +params['idevento']; // Convierte a número
      console.log('ID de evento:', this.idevento);
    });
    this.router.events.subscribe(() => {
      Swal.close();  // 🔹 Cierra el cuadro de diálogo cuando cambia la ruta
    });
    this.initDataTable();
  }
  initDataTable(): void {
    const that = this;
    this.ps.getPatrociniosEliminados(this.idevento).subscribe({
      next: (data) => {
        console.log(data);
        if ($.fn.DataTable.isDataTable('#miTabla')) {
          $('#miTabla').DataTable().destroy(true); // Destruye la tabla si ya existe
        }
        $('#miTabla').DataTable({
          data: data,
          autoWidth: false,  // Evita que las columnas tengan un ancho fijo
          columnDefs: [
            { targets: '_all', className: 'dt-center' },  // Centrar el contenido automáticamente
            { targets: [0, 1, 2], width: '33%'  }  // Ajustar ancho de columnas específicas
          ],
          columns: [
            { data: 'nombrePatrocinador', title: 'Patrocinador' },
            { data: 'evento_id', title: 'Evento' },
            {
              title: 'Acciones',
              render: function (data: any, type: any, row: any) {
                return `
              
                 <i role="button" class="fas fa-undo recuperar-btn" data-id="${row.idpatrocinio}"></i>`;

              },

            },
          ]
          ,

          language: {
            emptyTable: 'No hay patrocinios para mostrar.',
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

            $('table.dataTable thead').css({
              'background-color': '#343a40',
              'color': 'white',
              'font-weight': 'bold'
            });

            $('table.dataTable tbody tr:nth-child(even)').css({
              'background-color': '#f2f2f2'
            });


            $('#miTabla').on('click', '.recuperar-btn', function () {
              const idpatrocinio = $(this).data('id');
              console.log("id a recuperar")
              console.log(idpatrocinio);
              Swal.fire({
                title: '¿Estás seguro?',
                text: 'Los patrocinios recuperados se mostraran en la pestaña de Activos.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sí, continuar',
                cancelButtonText: 'Cancelar',
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33'
              }).then((result) => {
                if (result.isConfirmed) {
                  that.recuperarPatrocinio(idpatrocinio)
                } else {
                  console.log(" Usuario canceló la acción.");
                }
              });
            });

          },
        });
      }, error: (err) => {
        console.log("error", err);
      }
    });
  }
  GoDatosgenerales(): void {
    this.router.navigate(['dashboard/eventos/detalles/', this.idevento]);

  }
  GoRecursos(): void {
    //this.router.navigate(['dashboard/eventos/registrar_recurso/', this.idevento]);
    this.router.navigate(['dashboard/eventos/recursos/', this.idevento]);
  }
  GoActividades(): void {
    this.router.navigate(['dashboard/eventos/registrar_actividad/', this.idevento]);
  }
  GoActivos(): void {
    this.router.navigate(['dashboard/eventos/patrocinios/', this.idevento]);
  }
  recuperarPatrocinio(idpatrocinio: number): void {
    this.ps.recuperarPatrocinio(idpatrocinio).subscribe({
      next: () => {
        //alert("Patrocinio recuperado");
        Swal.fire({
          title: '¡Guardado!',
          text: 'Patrocinio recuperado correctamente.',
          icon: 'success',
          confirmButtonText: 'OK',
          confirmButtonColor: '#28a745'
        }).then(() => {
          location.reload();
        });
        //location.reload();
      },
      error: (err) => {
        console.log("error", err);
      },
    });
  }
}