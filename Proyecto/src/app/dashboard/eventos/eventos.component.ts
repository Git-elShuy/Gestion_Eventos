import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'datatables.net';
import $ from 'jquery';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from '../usuarios/usuario.service';
import { EventoService } from './evento.service';



@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent implements AfterViewInit, OnInit {
  idcarrera!: number;
  permiso !: number;
  constructor(private router: Router, private userService: UsuarioService, private es: EventoService) {

  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const usuario: any = jwtDecode(token);
      this.permiso = Number(localStorage.getItem('permisos'))
      this.getUserCarrera(usuario.sub.matricula);


    }
  }
  getUserCarrera(matricula: String) {
    this.userService.getUserCarrera(matricula).subscribe({
      next: (idcarrera) => {
        this.idcarrera = idcarrera;
        console.log("idcarrera: v")
        console.log(this.idcarrera);
        this.initDataTable();
      }, error: (err) => {
        console.log("err", err);
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
  initDataTable(): void {
    const that = this;
    this.es.getEventosByCarrera(this.idcarrera).subscribe({
      next: (data) => {
        if ($.fn.DataTable.isDataTable('#miTabla')) {
          $('#miTabla').DataTable().destroy(true); // Destruye la tabla actual
        }
        $('#miTabla').DataTable({
          data: data, // Datos obtenidos del backend
          autoWidth: false,  
          columnDefs: [
            { targets: '_all', className: 'dt-center' },  // Centrar el contenido automáticamente
            { targets: [0, 1, 2], width: '20%' }  // 🔹 Ajustar ancho de columnas específicas
          ],
          columns: [
            // { data: 'idUbicaciones', title: 'ID' },
            { data: 'nombre', title: 'Evento' },
            { data: 'descripcion', title: 'Descripcion' },
            { data: 'fechainicio', title: 'Inicio' },
            { data: 'fechafin', title: 'Fin' },
            {
              title: 'Acciones',
              render: function (data: any, type: any, row: any) {
                //return `<button class="btn btn-primary btn-sm editar-btn" data-id="${row.idUbicaciones}">Editar</button>`;
                // return `<a role="button" class="editar-btn" data-id="${row.idUbicaciones}"><i class="lni lni-search"></i></a>`;
                if (that.permiso == 1 || that.permiso == 2) {
                  return `
              
                 <i role="button" class="fa-solid fa-magnifying-glass editar-btn" data-id="${row.idevento}"></i>
    
                 <i role="button" class="fa-solid fa-trash eliminar-btn" data-id="${row.idevento}" style="margin-left: 10px; color:red;"></i>

             `;
                } else {
                  return `<i role="button" class="fa-solid fa-magnifying-glass editar-btn" data-id="${row.idevento}"></i> `
                }

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
            if (that.permiso == 1 || that.permiso == 2) {
              filterContainer.append(btn);
            }


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
              that.router.navigate(["dashboard/eventos/registrar"]);

            });
            $('#miTabla').on('click', '.editar-btn', function () {
              const idevento = $(this).data('id');
              that.router.navigate(['dashboard/eventos/detalles', idevento]);

            });
            $('#miTabla').on('click', '.eliminar-btn', function () {



            });
          }
        });
      }, error: (err) => {
        console.log("error", err);
      }
    });

  }



}
