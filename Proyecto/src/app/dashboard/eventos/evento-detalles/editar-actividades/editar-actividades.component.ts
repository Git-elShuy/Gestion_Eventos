import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Lugar } from '../../../ubicaciones/ubicacion';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { EventoService } from '../../evento.service';
import { UbicacionesService } from '../../../ubicaciones/ubicaciones.service';
import { RecursoService } from '../registrar-recurso/recurso.service';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from '../../../usuarios/usuario.service';
//import { param } from 'jquery';
@Component({
  selector: 'app-editar-actividades',
  templateUrl: './editar-actividades.component.html',
  styleUrl: './editar-actividades.component.css'
})
export class EditarActividadesComponent implements AfterViewInit, OnInit {
  idactividadevento!: number;
  idevento !: number;
  idcarrera!: number;
  ActividadForm!: FormGroup;
  lugares!: Lugar[];
  tipo_actividades!: any[];
  recursos !: any[];
  asistentes !: any[];
  usuarios_asignados !: any[];
  matricula !: String;
  show_expositorInput: boolean = false;
  constructor(private route: ActivatedRoute, private router: Router, private eventoService: EventoService, private ubicacionService: UbicacionesService
    , private recursoService: RecursoService, private userService: UsuarioService, private fb: FormBuilder
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
  getActividad(): void {

  }
  getRecursosActividad(): void {
    this.recursoService.getRecursosActividad(this.idactividadevento).subscribe({
      next: (recursos) => {
        this.recursos = recursos;

        console.log("RECURSOS", this.recursos);
      }, error: (err) => {
        console.log("error", err);
      },
    });
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
        this.userService.getUsuariosActividad(this.idactividadevento).subscribe({
          next: (usuarios_asignados) => {
            this.usuarios_asignados = usuarios_asignados;
            console.log("USUARIOS ASIGNADOS", this.usuarios_asignados);
          }, error: (err) => {
            console.log("error", err);
          }
        });
      }, error: (err) => {
        console.log("error", err);
      }
    });
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

    //const recursoId = this.RecursosArray.at(index).get('id')?.value;
    //const recurso = this.recursos.find(r => r.idrecurso == recursoId); // Usamos == para evitar desajuste tipo string/number

    //return recurso?.tipo ?? '';
    return '';
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
      this.matricula = usuario.sub.matricula;
      this.route.params.subscribe(params => {
        this.idactividadevento = +params['idactividadevento'];
        this.idevento = +params['idevento'];
      });
      console.log("ID ACTIVIDAD EVENTO", this.idactividadevento);
      this.router.events.subscribe(() => {
        Swal.close();
      });

      this.getTipoActividades();
      this.getLugares(this.idevento);
      this.getRecursosActividad();
      this.getUserCarrera(this.matricula);
      this.getFechasEvento();
      this.setupTipoActividadListener();
    }

  }
}
