import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UbicacionesService } from '../ubicaciones.service';
import { Router } from '@angular/router';
import { Ubicacion } from '../ubicacion';
import 'datatables.net';
import $ from 'jquery';

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
      next:()=>{
        location.reload();
      },
      error:(err)=>{
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
            btn.on('click', function () {

              that.router.navigate(['/dashboard/ubicaciones/registrar']);
            });
            $('#miTabla').on('click', '.recuperar-btn', function () {
              const nombreLugar = $(this).closest('tr').find('td:first').text();
              const confirmar = window.confirm(`¿Estás seguro de que quieres recuperar "${nombreLugar}"?`);
              if(confirmar){
                const idUbicacion = $(this).data('id');
                that.recuperarUbicacion(idUbicacion);
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
}
