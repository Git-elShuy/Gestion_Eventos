import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RecursoService } from '../../registrar-recurso/recurso.service';
import { EventoService } from '../../../evento.service';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from '../../../../usuarios/usuario.service';
import { Evento } from '../../../evento';
import Swal from 'sweetalert2';
import { PatrocinioService } from '../../patrocinios/patrocinio.service';
@Component({
  selector: 'app-editar-recurso',
  templateUrl: './editar-recurso.component.html',
  styleUrl: './editar-recurso.component.css'
})
export class EditarRecursoComponent implements AfterViewInit, OnInit {
  recursoForm!: FormGroup
  idrecurso!: number;
  idevento!: number;
  idcarrera!: number;
  eventos!: Evento[];
  constructor(private route: ActivatedRoute, private rs: RecursoService, private fb: FormBuilder, private router: Router, private es: EventoService,
    private us: UsuarioService, private ps: PatrocinioService
  ) {
    this.recursoForm = this.fb.group({
      idrecurso: [''],
      nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$')]],
      cantidad: ['', [Validators.required, Validators.min(1)]],
      es_patrocinado: ['', Validators.required],
      evento_id: ['', [Validators.required]],
      tipo: ['unidad', Validators.required],
      contenido_paquete: [{ value: '', disabled: true }]
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
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const usuario: any = jwtDecode(token);
      this.route.params.subscribe(params => {
        this.idrecurso = +params['idrecurso']; // Convierte a número
        this.idevento = +params['idevento'];
      });
      this.router.events.subscribe(() => {
        Swal.close();
      });
      console.log("idrecurso", this.idrecurso);
      console.log("idevento", this.idevento);
      this.getRecurso(this.idrecurso);
      this.getUserCarrera(usuario.sub.matricula);
    }

  }
  getUserCarrera(matricula: String): void {
    this.us.getUserCarrera(matricula).subscribe({
      next: (idcarrera) => {
        this.idcarrera = idcarrera;
        this.es.getEventosByCarrera(this.idcarrera).subscribe({
          next: (eventos) => {
            this.eventos = eventos;
            console.log("Eventos", this.eventos)
          }, error: (err) => {
            console.log("error", err);
          },
        });
      }, error: (err) => {
        console.log("error", err);
      },
    });
  }

  enviarFormulario(): void {
    if (this.recursoForm.valid) {
      console.log("entr FORM");
      if (this.idevento != this.recursoForm.value.evento_id) {
        console.log("ENTR CAMBIO EVENTO");
        this.rs.validarCambioRecurso(this.recursoForm.value.idrecurso).subscribe({
          next: (data) => {
            console.log("🔍 Respuesta del backend:", data);
            if (data.asignado === true) {
              console.log('ENTRO AL IF ASIGNADO');
              this.recursoForm.patchValue({
                evento_id: this.idevento
              });
              Swal.fire({
                title: '¡Atencion!',
                text: 'El recurso ya esta asignado a una actividad por lo que el cambio de evento no tomara efecto en la operacion.',
                icon: 'info',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#28a745'
              }).then((result) => {
                if (result.isConfirmed) {
                  this.rs.editarRecurso(this.idrecurso, this.idevento, this.recursoForm.value).subscribe({
                    next: () => {
                      //alert("Datos Actualizados.")
                      Swal.fire({
                        title: '¡Operación exitosa!',
                        text: 'El proceso se completó correctamente.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#28a745'
                      }).then((result) => {
                        if (result.isConfirmed) {
                          this.router.navigate(['dashboard/eventos/recursos/', this.idevento]);
                        }
                      });

                    }, error: (err) => {
                      console.log("error", err);
                      const mensajeError = err.error?.error || "Error desconocido en la solicitud";
                      Swal.fire({
                        title: '¡Atencion!',
                        text: mensajeError,
                        icon: 'info',
                        confirmButtonText: 'Aceptar',
                        confirmButtonColor: '#d33'
                      });
                    },
                  });
                }
              });
            } else {
              this.rs.editarRecurso(this.idrecurso, this.idevento, this.recursoForm.value).subscribe({
                next: () => {
                  //alert("Datos Actualizados.")
                  Swal.fire({
                    title: '¡Operación exitosa!',
                    text: 'El proceso se completó correctamente.',
                    icon: 'success',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#28a745'
                  }).then((result) => {
                    if (result.isConfirmed) {
                      this.router.navigate(['dashboard/eventos/recursos/', this.idevento]);
                    }
                  });

                }, error: (err) => {
                  console.log("error", err);
                  const mensajeError = err.error?.error || "Error desconocido en la solicitud";
                  Swal.fire({
                    title: '¡Atencion!',
                    text: mensajeError,
                    icon: 'info',
                    confirmButtonText: 'Aceptar',
                    confirmButtonColor: '#d33'
                  });
                },
              });
            }
          }, error: (err) => {

          }
        });
      } else {
        this.rs.editarRecurso(this.idrecurso, this.idevento, this.recursoForm.value).subscribe({
          next: () => {
            //alert("Datos Actualizados.")
            Swal.fire({
              title: '¡Operación exitosa!',
              text: 'El proceso se completó correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#28a745'
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['dashboard/eventos/recursos/', this.idevento]);
              }
            });

          }, error: (err) => {
            console.log("error", err);
            const mensajeError = err.error?.error || "Error desconocido en la solicitud";
            Swal.fire({
              title: '¡Atencion!',
              text: mensajeError,
              icon: 'info',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#d33'
            });
          },
        });
      }
    }
  }
  GoDatosGenerales(): void {
    this.router.navigate(['dashboard/eventos/detalles', this.idevento]);
  }
  GoPatrocinios(): void {
    this.router.navigate(['dashboard/eventos/patrocinios', this.idevento]);
  }
  GoActividades(): void {
    this.router.navigate(['dashboard/eventos/registrar_actividad', this.idevento]);
  }
  getRecurso(idrecurso: number): void {
    this.rs.getRecursoByid(idrecurso).subscribe({
      next: (data) => {
        console.log("data", data);
        /*this.recursoForm.patchValue({
          nombre: data.nombre,
          cantidad: data.cantidad,
          evento_id: data.evento_id,
          tipo: data.tipo,
          contenido_paquete: data.contenido_paquete

        });*/
        this.recursoForm.patchValue(data);
        this.verificarTipo();
        console.log("form", this.recursoForm.value);
      }, error: (err) => {

      },
    });
  }
  verificarTipo(): void {
    console.log("entro verificar tipo")
    const tipoSeleccionado = this.recursoForm.get('tipo')?.value;

    if (tipoSeleccionado === 'paquete') {
      this.recursoForm.get('contenido_paquete')?.enable();
      this.recursoForm.get('contenido_paquete')?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      this.recursoForm.get('contenido_paquete')?.disable();
      this.recursoForm.get('contenido_paquete')?.clearValidators();
    }

    this.recursoForm.get('contenido_paquete')?.updateValueAndValidity();
  }

}
