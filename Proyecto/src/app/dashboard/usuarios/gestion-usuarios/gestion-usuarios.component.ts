import { AfterViewInit, Component, OnInit } from '@angular/core';
import { UsuarioService } from '../usuario.service';
import { jwtDecode } from 'jwt-decode';
import 'datatables.net';
import $ from 'jquery';
import { Carrera } from '../../carreras/carrera';
import { CarreraService } from '../../carreras/carrera.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrl: './gestion-usuarios.component.css'
})
export class GestionUsuariosComponent implements AfterViewInit, OnInit {
  carreras!: Carrera[];
  permisos!: any[];
  constructor(private us: UsuarioService, private cs: CarreraService, private router: Router) { }
  ngOnInit(): void {
    const permiso = Number(localStorage.getItem('permisos'))
    const token = localStorage.getItem('token');
    if (token) {
      this.router.events.subscribe(() => {
        Swal.close();
      });
      this.cs.getCarreras().subscribe({
        next: (carreras) => {
          this.carreras = carreras;
          console.log(this.carreras);

        }, error: (err) => {
          console.log("error", err);
        }
      });

      const usuario: any = jwtDecode(token);
      if (permiso == 1) {
        //lo que veran los super admins, todos los admis de la misma carrera
        this.us.getPermits().subscribe({
          next: (permisos) => {
            this.permisos = permisos;
            console.log(this.permisos);
          }, error: (err) => {
            console.log("error", err);
          },
        });
        this.initDataTable1(usuario.sub.matricula);
      }
      if (permiso == 2) {
        //lo que veran los admins, todos los asistentes de la misma carrera
        this.us.getPermitsForAdmin().subscribe({
          next: (permisos) => {
            this.permisos = permisos;
            console.log(this.permisos);
          },
          error: (err) => console.error("Error al obtener permisos:", err)
        });

        this.initDataTable2(usuario.sub.matricula);
      }
    }


  }
  initDataTable1(matricula: String) {
    const that = this;
    this.us.getUserCarrera(matricula).subscribe({
      next: (idcarrera) => {
        //this.idcarrera = idcarrera;
        console.log(idcarrera);
        //console.log(this.idcarrera);
        //trae a los usuarios administradores por su id de carrera
        this.us.getAdminCarreras(idcarrera).subscribe({
          next: (data) => {
            console.log(data);
            if ($.fn.DataTable.isDataTable('#miTabla')) {
              $('#miTabla').DataTable().destroy(true); // Destruye la tabla si ya existe
            }
            $('#miTabla').DataTable({
              data: data, // Datos obtenidos del backend
              columns: [
                { data: 'matricula', title: 'Matrícula' },
                { data: 'nombre', title: 'Nombre' },
                { data: 'apellido', title: 'Apellido' },
                {
                  data: 'idcarrera', title: 'Carrera', render: function (data, type, row) {
                    let selectHTML = `<select class="select-carrera" data-id="${row.matricula}">`;
                    that.carreras.forEach(carrera => {
                      selectHTML += `<option value="${carrera.idcarreras}" ${carrera.idcarreras == data ? "selected" : ""}>${carrera.nombre}</option>`;
                    });
                    selectHTML += `</select>`;
                    return selectHTML;
                  }
                },
                {
                  data: 'idpermiso', title: 'Permisos', render: function (data, type, row) {
                    let selectHTML = `<select class="select-permisos" data-id="${row.matricula}">`;
                    that.permisos.forEach(permiso => {
                      selectHTML += `<option value="${permiso.idpermiso}" ${permiso.idpermiso == data ? "selected" : ""}>${permiso.nombre}</option>`;
                    });
                    selectHTML += `</select>`;
                    return selectHTML;
                  }
                },
                {
                  data: 'eliminar', title: 'Status', render: (data, type, row) => {
                    let selectHTML = `<select class="select-status" data-id="${row.matricula}">`;

                    const opciones = [
                      { id: 0, nombre: "Activo" },
                      { id: 1, nombre: "Inactivo" }
                    ];

                    opciones.forEach((estado) => {
                      selectHTML += `<option value="${estado.id}" ${estado.id == data ? "selected" : ""}>${estado.nombre}</option>`;
                    });

                    selectHTML += `</select>`;
                    return selectHTML;
                  }
                }
              ],
              language: {
                emptyTable: 'No hay admins para mostrar.',
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
                //const btn = $('<i class="lni lni-plus ms-2" role="button"></i>');
                //filterContainer.append(btn);
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
                $('.select-carrera, .select-permisos, .select-status').css({
                  'width': '100%',
                  'padding': '8px',
                  //'border': '2px solid #007bff',
                  'border-radius': '6px',
                  'background-color': '#f8f9fa',
                  'font-size': '14px',
                });
                $('.select-status').css({
                  'text-transform': 'uppercase'
                });
                $('#miTabla').on('change', 'select', function () {
                  Swal.fire({
                    title: `¿Estás seguro de que quieres editar?`,
                    text: '',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, continuar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const matricula = $(this).data('id');  // Obtener matrícula del usuario
                      const nuevoValor = $(this).val();      // Obtener el nuevo valor seleccionado
                      const columna = $(this).hasClass('select-carrera') ? 'id_carrera' :
                        $(this).hasClass('select-permisos') ? 'id_permiso' :
                          $(this).hasClass('select-status') ? 'eliminar' : '';

                      if (!columna) {
                        console.warn("No se identificó un campo válido para actualizar.");
                        return;
                      }

                      console.log(`Usuario ${matricula} cambió ${columna} a: ${nuevoValor}`);


                      fetch(`http://localhost:5000/api/usuarios/cambiar_${columna}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ matricula, [columna]: nuevoValor })
                      }).then(response => {
                        if (response.ok) {
                          Swal.fire({
                            title: '¡Operación exitosa!',
                            text: 'El proceso se completó correctamente.',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#28a745'
                          }).then((result) => {
                            if (result.isConfirmed) {
                              window.location.reload();  //Recargar la vista después de actualizar
                            }
                          });

                        }
                      }).catch(error => console.error("Error al actualizar:", error));
                    } else {
                      location.reload();
                    }
                  });

                  /*$.ajax({
                    url: `API_URL/cambiar_${columna}`,
                    type: "POST",
                    data: JSON.stringify({ matricula: matricula, [columna]: nuevoValor }),  // Ahora `nuevoValor` está definido correctamente
                    contentType: "application/json",
                    success: function (response) {
                      console.log(`${columna} actualizado correctamente.`);
                    },
                    error: function (err) {
                      console.error(`Error al actualizar ${columna}:`, err);
                    }
                  });*/


                });



              },
            });


          },
          error: (err) => {

            console.log("error", err);
          }
        });
      },
      error: (err) => {
        console.log("error", err);
      },
    });


  }
  initDataTable2(matricula: String) {
    const that = this;
    this.us.getUserCarrera(matricula).subscribe({
      next: (idcarrera) => {
        //this.idcarrera = idcarrera;
        console.log(idcarrera);
        //console.log(this.idcarrera);
        this.us.getAsistentesCarreras(idcarrera).subscribe({
          next: (data) => {
            console.log(data);
            if ($.fn.DataTable.isDataTable('#miTabla')) {
              $('#miTabla').DataTable().destroy(true); // Destruye la tabla si ya existe
            }
            $('#miTabla').DataTable({
              data: data, // Datos obtenidos del backend
              columns: [
                { data: 'matricula', title: 'Matrícula' },
                { data: 'nombre', title: 'Nombre' },
                { data: 'apellido', title: 'Apellido' },
                {
                  data: 'idcarrera', title: 'Carrera', render: function (data, type, row) {
                    let selectHTML = `<select class="select-carrera" data-id="${row.matricula}">`;
                    that.carreras.forEach(carrera => {
                      selectHTML += `<option value="${carrera.idcarreras}" ${carrera.idcarreras == data ? "selected" : ""}>${carrera.nombre}</option>`;
                    });
                    selectHTML += `</select>`;
                    return selectHTML;
                  }
                },
                {
                  data: 'idpermiso', title: 'Permiso', render: (data, type, row) => {
                    let selectHTML = `<select class="select-permisos" data-id="${row.matricula}">`;

                    that.permisos.forEach((permiso) => {
                      selectHTML += `<option value="${permiso.idpermiso}" ${permiso.idpermiso == data ? "selected" : ""}>${permiso.nombre}</option>`;
                    });

                    selectHTML += `</select>`;
                    return selectHTML;
                  }
                },

                {
                  data: 'eliminar', title: 'Status', render: (data, type, row) => {
                    let selectHTML = `<select class="select-status" data-id="${row.matricula}">`;

                    const opciones = [
                      { id: 0, nombre: "Activo" },
                      { id: 1, nombre: "Inactivo" }
                    ];

                    opciones.forEach((estado) => {
                      selectHTML += `<option value="${estado.id}" ${estado.id == data ? "selected" : ""}>${estado.nombre}</option>`;
                    });

                    selectHTML += `</select>`;
                    return selectHTML;
                  }
                }
              ],
              language: {
                emptyTable: 'No hay asistentes para mostrar.',
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
                //const btn = $('<i class="lni lni-plus ms-2" role="button"></i>');
                //filterContainer.append(btn);
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
                $('.select-carrera, .select-permisos, .select-status').css({
                  'width': '100%',
                  'padding': '8px',
                  //'border': '2px solid #007bff',
                  'border-radius': '6px',
                  'background-color': '#f8f9fa',
                  'font-size': '14px',
                });
                $('.select-status').css({
                  'text-transform': 'uppercase'
                });
                $('#miTabla').on('change', 'select', function () {
                  Swal.fire({
                    title: `¿Estás seguro de que quieres editar?`,
                    text: '',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, continuar',
                    cancelButtonText: 'Cancelar',
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      const matricula = $(this).data('id');  // Obtener matrícula del usuario
                      const nuevoValor = $(this).val();      // Obtener el nuevo valor seleccionado
                      const columna = $(this).hasClass('select-carrera') ? 'id_carrera' :
                        $(this).hasClass('select-permisos') ? 'id_permiso' :
                          $(this).hasClass('select-status') ? 'eliminar' : '';

                      if (!columna) {
                        console.warn("No se identificó un campo válido para actualizar.");
                        return;
                      }

                      console.log(`Usuario ${matricula} cambió ${columna} a: ${nuevoValor}`);


                      fetch(`http://localhost:5000/api/usuarios/cambiar_${columna}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ matricula, [columna]: nuevoValor })
                      }).then(response => {
                        if (response.ok) {
                          Swal.fire({
                            title: '¡Operación exitosa!',
                            text: 'El proceso se completó correctamente.',
                            icon: 'success',
                            confirmButtonText: 'Aceptar',
                            confirmButtonColor: '#28a745'
                          }).then((result) => {
                            if (result.isConfirmed) {
                              window.location.reload();  //Recargar la vista después de actualizar
                            }
                          });

                        }
                      }).catch(error => console.error("Error al actualizar:", error));
                    } else {
                      location.reload();
                    }
                  });


                });



              },
            });


          },
          error: (err) => {

            console.log("error", err);
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
