import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EventoService } from '../../evento.service';
import 'datatables.net';
import $ from 'jquery';
//import { filter } from 'rxjs';
@Component({
  selector: 'app-ver-actividades',
  templateUrl: './ver-actividades.component.html',
  styleUrl: './ver-actividades.component.css'
})
export class VerActividadesComponent implements AfterViewInit, OnInit {
  idevento !: number;
  actividades !: any[];
  constructor(private route: ActivatedRoute, private router: Router, private eventoService: EventoService) {

  }
  GoDatosgenerales(): void {
    this.router.navigate(['dashboard/eventos/detalles/', this.idevento]);
  }
  GoRecursos(): void {
    //this.router.navigate(['dashboard/eventos/registrar_recurso/', this.idevento]);
    this.router.navigate(['dashboard/eventos/recursos/', this.idevento]);
  }
  GoPatrocinios(): void {
    this.router.navigate(['dashboard/eventos/patrocinios/', this.idevento]);
  }
  GoInactivos(): void {
    //this.router.navigate(['dashboard/eventos/patrocinios/eliminados/', this.idevento]);
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
    this.route.params.subscribe(params => {
      this.idevento = +params['idevento'];
    });
    this.router.events.subscribe(() => {
      Swal.close();
    });
    this.initDataTable();
  }
  initDataTable(): void {
    const that = this;
    this.eventoService.getActividades(this.idevento).subscribe({
      next: (data) => {
        //this.actividades = data;
        console.log("ACTIVIDADES", data);
        if ($.fn.DataTable.isDataTable('#miTabla')) {
          $('#miTabla').DataTable().destroy(true); // Destruye la tabla si ya existe
        }
        $('#miTabla').DataTable({
          data: data,
          autoWidth: false,
          columnDefs: [
            { targets: '_all', className: 'dt-center' },  // Centrar el contenido automáticamente
            { targets: [0, 1, 2, 3, 4, 5, 6], width: '14%' }  // Ajustar ancho de columnas específicas
          ],
          columns: [
            { data: 'nombre', title: 'Nombre' },
            { data: 'hora_inicio', title: 'HI' },
            { data: 'hora_fin', title: 'HF' },
            { data: 'lugar_id', title: 'Lugar' },
            { data: 'id_tipoactv', title: 'TA' },
            { data: 'fecha', title: 'Fecha' },
            { data: 'expositor', title: 'expositor' },
            {
              title: 'Acciones',
              render: function (data: any, type: any, row: any) {
                return `
              
                 <i role="button" class="fa-solid fa-magnifying-glass editar-btn" data-id="${row.idevento_actividad}"></i>
    
                 <i role="button" class="fa-solid fa-trash eliminar-btn" data-id="${row.idevento_actividad}" style="margin-left: 10px; color:red;"></i>

             `;

              },

            },


          ],
          language: {
            emptyTable: 'No hay actividades para mostrar.',
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
              that.router.navigate(['dashboard/eventos/registrar_actividad/', that.idevento]);
            });
            $('#miTabla').on('click', '.editar-btn', function () {
              const idactividadevento = $(this).data('id');
              console.log("IDACTIVIDADEVENTO", idactividadevento);
              that.router.navigate(['dashboard/eventos/editar_actividad', that.idevento, idactividadevento]);
            });
            $('table.dataTable thead').css({
              'background-color': '#343a40',
              'color': 'white',
              'font-weight': 'bold'
            });

            $('table.dataTable tbody tr:nth-child(even)').css({
              'background-color': '#f2f2f2'
            });
          }
        });
      }, error: (err) => {
        console.log("error", err);
      }
    });
  }

}
