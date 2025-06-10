import { AfterViewChecked, AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UbicacionesService } from '../../../ubicaciones/ubicaciones.service';
import { EventoService } from '../../evento.service';
import { Lugar } from '../../../ubicaciones/ubicacion';
import { RecursoService } from '../registrar-recurso/recurso.service';
//import { ChangeDetectorRef } from '@angular/core';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../usuarios/usuario.service';
import { jwtDecode } from 'jwt-decode';
@Component({
  selector: 'app-registrar-actividad',
  templateUrl: './registrar-actividad.component.html',
  styleUrl: './registrar-actividad.component.css'
})
export class RegistrarActividadComponent implements AfterViewInit, OnInit, AfterViewChecked {
  idevento!: number;
  idcarrera!: number;
  ActividadForm: FormGroup;
  lugares!: Lugar[];
  tipo_actividades!: any[];
  recursos !: any[];
  asistentes !: any[];
  matricula !: String;
  show_expositorInput: boolean = false;

  //recursosDisponibles: any[] = [];
  constructor(private route: ActivatedRoute, private fb: FormBuilder, private ubicacionService: UbicacionesService, private eventoService: EventoService,
    private recursoService: RecursoService, private router: Router, private userService: UsuarioService
  ) {
    this.ActividadForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚüÜ0-9 ]+$')]],
      hora_inicio: ['', [Validators.required]],
      hora_fin: ['', [Validators.required]],
      evento_id: ['', [Validators.required]],
      lugar_id: ['', [Validators.required]],
      id_tipoactv: ['', [Validators.required]],
      fecha: ['', [Validators.required]],
      expositor: [{ value: '', disabled: true }],
      asistentes: this.fb.array([], Validators.required),
      recursos_id: this.fb.array([], Validators.required)
    }, { validators: [this.validarHoraInicioFin()] });
  }
  get RecursosArray(): FormArray {
    return this.ActividadForm.get('recursos_id') as FormArray;
  }
  get asistentesArray(): FormArray {
    return this.ActividadForm.get('asistentes') as FormArray;
  }
  /*get recursosDisponibles(): any[] {
    const recursosSeleccionados = this.RecursosArray.controls.map(control => control.value.id);

    return this.recursos.filter(recurso => !recursosSeleccionados.includes(recurso.idrecurso));
  }*/
  validarStock(indexActual: number) {
    //console.log("entro validar stock")
    const recursoId = this.RecursosArray.at(indexActual)?.get('id')?.value;
    //console.log(recursoId);
    // const recursoSeleccionado = this.recursos.find(recurso => recurso.idrecurso === recursoId);
    const recursoSeleccionado = this.recursos.find(recurso => Number(recurso.idrecurso) === Number(recursoId));


    if (recursoSeleccionado) {
      const stockDisponible = recursoSeleccionado.cantidad;
      const cantidadIngresada = this.RecursosArray.at(indexActual)?.get('cantidad_utilizada')?.value;
      //console.log("stock disponible", stockDisponible);
      //console.log("cant ingresada", cantidadIngresada);
      if (cantidadIngresada > stockDisponible) {
        this.RecursosArray.at(indexActual)?.get('cantidad_utilizada')?.setErrors({ stockExcedido: true });
      } else {
        this.RecursosArray.at(indexActual)?.get('cantidad_utilizada')?.setErrors(null);
      }
    }
  }

  getRecursosFiltrados(indexActual: number): any[] {
    const idsSeleccionados = this.RecursosArray.controls
      .map((ctrl, idx) => idx !== indexActual ? Number(ctrl.get('id')?.value) : null)
      .filter(id => id !== null);
    //console.log("idseleccionados", idsSeleccionados);
    return this.recursos.filter(r => !idsSeleccionados.includes(r.idrecurso));
  }

  todosRecursosSeleccionados(): boolean {
    const idsSeleccionados = this.RecursosArray.controls
      .map(ctrl => Number(ctrl.get('id')?.value))
      .filter(id => id); // Elimina nulos/vacíos

    // Si todos los recursos han sido seleccionados
    return idsSeleccionados.length >= this.recursos.length;

  }
  getAsistentesFiltrados(indexActual: number): any[] {
    const matriculasSeleccionadas = this.asistentesArray.controls
      .map((ctrl, idx) => idx !== indexActual ? (ctrl.get('matricula')?.value) : null)
      .filter(matricula => matricula !== null && matricula !== '');
    //console.log("Matricula seleccionada", matriculasSeleccionadas);
    return this.asistentes.filter(a => !matriculasSeleccionadas.includes(a.matricula));
  }
  todosAsistentesSeleccionados(): boolean {
    const matriculasSeleccionadas = this.asistentesArray.controls
      .map(ctrl => ctrl.get('matricula')?.value)
      .filter(matricula => matricula);
    return matriculasSeleccionadas.length >= this.asistentes.length;
  }

  getUserCarrera(matricula: String): void {
    this.userService.getUserCarrera(matricula).subscribe({
      next: (idcarrera) => {
        this.idcarrera = idcarrera;
        this.getUsuariosCarrera(this.idcarrera);
      }, error: (err) => {
        console.log("error", err);
      },
    });
  }
  getUsuariosCarrera(idcarrera: number): void {
    this.userService.getAsistentesCarreras(idcarrera).subscribe({
      next: (usuarios) => {
        this.asistentes = usuarios;
        console.log("asistentes", this.asistentes);
      }, error: (err) => {
        console.log("error", err);
      }
    });
  }


  enviarFormulario(): void {

    if (this.ActividadForm.valid) {
      const data: any = this.ActividadForm.value;
      const convertirHora = (hora: String) => {
        const [horas, minutos] = hora.split(':').map(Number);
        const periodo = horas >= 12 ? 'PM' : 'AM';
        const horas12 = horas % 12 || 12;  // 🔹 Convertir 00 a 12 y ajustar formato
        return `${horas12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
      };
      const horaInicio = data.hora_inicio;
      const horaFin = data.hora_fin;
      const horaInicioFormateada = convertirHora(horaInicio);
      const horaFinFormateada = convertirHora(horaFin);
      data.hora_inicio = horaInicioFormateada;
      data.hora_fin = horaFinFormateada;
      console.log("FORM", this.ActividadForm.value);
      this.eventoService.addActividad(data).subscribe({
        next: () => {
          Swal.fire({
            title: '¡Éxito!',
            text: 'La operación se realizó correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          }).then((result => {
            if (result.isConfirmed) {
              //location.reload();
              this.router.navigate(['dashboard/eventos/actividades/', this.idevento]);
            }
          }));

        }, error: (err) => {
          console.log("error al registrar actividad", err);
          const mensajeError = err.error?.error || "Error desconocido en la solicitud";
          Swal.fire({
            title: '¡Atencion!',
            text: mensajeError,
            icon: 'info',
            confirmButtonText: 'Aceptar',
            //confirmButtonColor: '#d33'
          });
          this.ActividadForm.patchValue({
            hora_inicio: horaInicio,
            hora_fin: horaFin
          });
        }
      });
    }
  }
  removeRecurso(index: number): void {
    Swal.fire({
      title: `¿Estás seguro de que quieres eliminar?`,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {


        this.RecursosArray.removeAt(index); // Remover de la UI
      } else {
        console.log("Usuario canceló la acción.");
      }
    });
  }



  limpiarRecursosVacios(): void {
    const recursos = this.RecursosArray;

    for (let i = recursos.length - 1; i >= 0; i--) {
      const recursoGroup = recursos.at(i);
      const id = recursoGroup.get('id')?.value;

      if (!id) {
        recursos.removeAt(i);
      }
    }
  }
  limpiarAsistentesVacios(): void {
    const asistentes = this.asistentesArray;
    for (let i = asistentes.length - 1; i >= 0; i--) {
      const asistenteGroup = asistentes.at(i);
      const matricula = asistenteGroup.get('matricula')?.value;
      if (!matricula) {
        asistentes.removeAt(i);
      }
    }
  }


  addRecurso(): void {
    if (this.todosRecursosSeleccionados()) {
      Swal.fire({
        icon: 'info',
        title: 'Todos los recursos han sido seleccionados',
        text: 'No puedes agregar más.',
        timer: 3000,
        showConfirmButton: false
      });
      this.limpiarRecursosVacios();
    } else {
      const recurso = this.fb.group({
        id: ['', [Validators.required]],
        cantidad_utilizada: ['', [Validators.required, Validators.min(1)]]
      })
      this.RecursosArray.push(recurso);
    }
  }
  addAsistente(): void {
    if (this.todosAsistentesSeleccionados()) {
      Swal.fire({
        icon: 'info',
        title: 'Todos los asistentes han sido seleccionados',
        text: 'No puedes agregar más.',
        timer: 3000,
        showConfirmButton: false
      });
      this.limpiarAsistentesVacios();
    } else {
      const asistente = this.fb.group({
        matricula: ['', [Validators.required]],
        descripcion_actividad: ['', [Validators.required]]
      })
      this.asistentesArray.push(asistente);
    }

  }
  validarEstadoInput(indexActual: number) {
    //const recursoId = this.RecursosArray.at(indexActual)?.get('id')?.value;
    const cantidadControl = this.RecursosArray.at(indexActual)?.get('cantidad_utilizada');
    cantidadControl?.setValue('');

    /*if (recursoId) {
      cantidadControl?.enable(); // 🔹 Habilita el input si hay un recurso seleccionado
      cantidadControl?.setValue(''); // 🔹 Limpia la cantidad utilizada para validar correctamente
    } else {
      cantidadControl?.disable(); // 🔹 Deshabilita el input si no se ha seleccionado un recurso
    }*/
  }

  removeAsistente(index: number): void {
    Swal.fire({
      title: `¿Estás seguro de que quieres eliminar?`,
      text: '',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, continuar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {


        this.asistentesArray.removeAt(index); // Remover de la UI
      } else {
        console.log("Usuario canceló la acción.");
      }
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
    /*const toggler = document.querySelector(".toggler-btn");
    const sidebar = document.querySelector("#sidebar");
    const main = document.querySelector(".main");
  
    const handleSidebar = () => {
      if (!main || !sidebar) return;
  
      const mainHeight = main.scrollHeight;
      const sidebarHeight = sidebar.scrollHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
  
      if (mainHeight > sidebarHeight) {
        // Colapsar si el contenido principal es más alto
        sidebar.classList.add("collapsed");
  
        // Si está hasta arriba, permitir expandir
        if (scrollTop <= 10) {
          sidebar.classList.remove("collapsed");
        }
      }
    };
  
    window.addEventListener("scroll", handleSidebar);
    window.addEventListener("resize", handleSidebar);
  
    if (toggler) {
      toggler.addEventListener("click", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        // Solo permitir expandir si está hasta arriba
        if (sidebar?.classList.contains("collapsed") && scrollTop <= 10) {
          sidebar.classList.remove("collapsed");
        } else {
          sidebar?.classList.add("collapsed");
        }
      });
    }
  
    // Ejecutar al inicio
    handleSidebar();*/
  }


  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const usuario: any = jwtDecode(token);
      this.matricula = usuario.sub.matricula;
      this.route.params.subscribe(params => {
        this.idevento = +params['idevento']; // Convierte a número
        console.log('ID de evento:', this.idevento);
      });
      this.ActividadForm.patchValue({
        evento_id: this.idevento
      });
      this.router.events.subscribe(() => {
        Swal.close();
      });
      this.getTipoActividades();
      this.getLugares(this.idevento);
      this.getRecursos();
      this.getUserCarrera(this.matricula);
      this.getFechasEvento();
      this.setupTipoActividadListener();

    }

  }
  ngAfterViewChecked(): void {
    //this.cdRef.detectChanges();
  }
  validarFechaActividadEnRango = (fechaInicioEvento: string, fechaFinEvento: string) => {
    return (control: AbstractControl): ValidationErrors | null => {
      const fechaActividad = control.value;

      if (!fechaActividad || !fechaInicioEvento || !fechaFinEvento) {
        return null; // No validamos si falta algo
      }

      const actividad = new Date(fechaActividad);
      const inicio = new Date(fechaInicioEvento);
      const fin = new Date(fechaFinEvento);

      if (actividad < inicio || actividad > fin) {
        return { fechaFueraDeRango: true };
      }

      return null;
    };
  };
  validarHoraInicioFin(): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const horaInicio = group.get('hora_inicio')?.value;
      const horaFin = group.get('hora_fin')?.value;

      if (!horaInicio || !horaFin) return null;

      // Convertir a objetos Date solo con hora
      const [hIni, mIni] = horaInicio.split(':').map(Number);
      const [hFin, mFin] = horaFin.split(':').map(Number);

      const inicio = new Date();
      inicio.setHours(hIni, mIni, 0, 0);

      const fin = new Date();
      fin.setHours(hFin, mFin, 0, 0);

      /*if (inicio >= fin) {
        return { horaInvalida: true };
      }*/
      if (fin <= inicio) {
        return { FinMenorInicio: true };
      }

      return null;
    };
  }


  getFechasEvento(): void {
    this.eventoService.getFechasEvento(this.idevento).subscribe({
      next: (data) => {
        //console.log("fechas evento", data);
        const fechaActividad = this.ActividadForm.get('fecha');
        fechaActividad?.setValidators([
          Validators.required, this.validarFechaActividadEnRango(data.fechainicio, data.fechafin)
        ]);
        fechaActividad?.updateValueAndValidity();
      }, error: (err) => {
        console.log("error", err);
      },
    });
  }

  getLugares(idevento: number): void {
    this.eventoService.getUbicacionByeventoId(idevento).subscribe({
      next: (idUbicacion) => {
        this.ubicacionService.getLugaresUbicacionById(idUbicacion).subscribe({
          next: (lugares) => {
            this.lugares = lugares;
            console.log("LUGARES", lugares);

          }, error: (err) => {
            console.log("error", err);
          },
        });
      }, error: (err) => {
        console.log("error", err);

      },
    });
  }
  getTipoActividades(): void {
    this.eventoService.getTipoActividades().subscribe({
      next: (tipo_actividades) => {
        this.tipo_actividades = tipo_actividades;

        console.log("TIPO ACTIVIDADEs:", this.tipo_actividades);
      }, error: (err) => {
        console.log("error", err);
      },
    });
  }
  getRecursos(): void {
    this.recursoService.getRecursos(this.idevento).subscribe({
      next: (recursos) => {
        this.recursos = recursos;

        console.log("RECURSOS", this.recursos);
      }, error: (err) => {
        console.log("error", err);
      },
    });
  }


  setupTipoActividadListener() {

    this.ActividadForm.get('id_tipoactv')?.valueChanges.subscribe(valor => {
      //console.log('Tipo de actividad seleccionada:', valor);


      if (valor === "4" || valor === "5") {
        //console.log("entro 4 o 5");
        this.ActividadForm.get('expositor')?.enable();
        this.ActividadForm.get('expositor')?.setValidators([Validators.required, Validators.pattern("^(?:[A-Za-zñÑáéíóúÁÉÍÓÚüÜ]+\\. )?[A-Za-zñÑáéíóúÁÉÍÓÚüÜ]+(?: [A-Za-zñÑáéíóúÁÉÍÓÚüÜ]+)*$")]);
        this.show_expositorInput = true;
      } else {
        //console.log("erga");
        this.ActividadForm.get('expositor')?.disable();
        this.ActividadForm.get('expositor')?.clearValidators();
        this.show_expositorInput = false;
      }
      this.ActividadForm.get('expositor')?.updateValueAndValidity();
    });
  }

  getTipoDeRecurso(index: number): string {
    if (!this.recursos || this.recursos.length === 0) return ''; // Aún no cargan

    const recursoId = this.RecursosArray.at(index).get('id')?.value;
    const recurso = this.recursos.find(r => r.idrecurso == recursoId); // Usamos == para evitar desajuste tipo string/number

    return recurso?.tipo ?? '';
  }


}
