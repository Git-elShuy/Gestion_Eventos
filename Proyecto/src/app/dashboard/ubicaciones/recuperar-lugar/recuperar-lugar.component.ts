import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UbicacionesService } from '../ubicaciones.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Lugar } from '../ubicacion';
import 'datatables.net';
import $ from 'jquery';
@Component({
  selector: 'app-recuperar-lugar',
  templateUrl: './recuperar-lugar.component.html',
  styleUrl: './recuperar-lugar.component.css'
})
export class RecuperarLugarComponent implements OnInit, AfterViewInit {
  idUbicacion!: number
  lugares: Lugar[] = [];
  //lugaresRecuperar: number[] = [];
  //mensajeSinLugaresEliminados = '';
  constructor(private us: UbicacionesService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idUbicacion = +params['idUbicacion']; // Convierte a número
      console.log('ID de ubicación:', this.idUbicacion);
    });
    this.initDataTable();
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

  recuperarLugar(idLugar: number): void {
    this.us.recuperarLugar(idLugar).subscribe({
      next: () => {
        //location.reload();
        //this.router.navigate([''])
        this.router.navigate(['/dashboard/ubicaciones/editar/',this.idUbicacion]);
      },
      error: (err) => {
        console.log("error al recuperar", err)
      }
    });
  }
  initDataTable(): void {
    const that = this;

    this.us.getLugaresPorUbicacion(this.idUbicacion).subscribe({
      next: (lugares) => {
        this.lugares = lugares;



        if ($.fn.DataTable.isDataTable('#miTabla')) {
          $('#miTabla').DataTable().destroy(true);
        }

        $('#miTabla').DataTable({
          data: lugares,
          columns: [
            { data: 'nombreLugar', title: 'Nombre' },
            { data: 'capacidad', title: 'Capacidad' },
            {
              title: 'Acciones',
              render: function (data: any, type: any, row: any) {
                return `<a role="button" class="recuperar-btn" data-id="${row.idubicaciones_lugar}"><i class="fas fa-undo"></i></a>`;
              },
            },
          ],
          language: {
            emptyTable:'No hay lugares para mostrar.',
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
            $('#miTabla').on('click', '.recuperar-btn', function () {
              const nombreLugar = $(this).closest('tr').find('td:first').text();
              const confirmar = window.confirm(`¿Estás seguro de que quieres recuperar "${nombreLugar}"?`);
              if (confirmar) {
                const idLugar = $(this).data('id');
                that.recuperarLugar(idLugar);
                //location.reload();
              }
            });
          },
        });
      },
      error: (err) => {
        console.error("Error al obtener lugares:", err);
      }
    });
  }

}
