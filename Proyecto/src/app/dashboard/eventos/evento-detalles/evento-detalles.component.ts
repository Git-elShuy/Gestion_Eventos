import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../evento.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Evento } from '../evento';
import { UbicacionesService } from '../../ubicaciones/ubicaciones.service';
import { Ubicacion } from '../../ubicaciones/ubicacion';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-evento-detalles',
  templateUrl: './evento-detalles.component.html',
  styleUrl: './evento-detalles.component.css'
})
export class EventoDetallesComponent implements AfterViewInit, OnInit {
  permiso!: Number;
  idevento!: number;
  EventoForm: FormGroup;
  ubicaciones!: Ubicacion[];
  constructor(private route: ActivatedRoute, private es: EventoService, private fb: FormBuilder, private us: UbicacionesService, private router: Router) {
    this.EventoForm = this.fb.group({
      idevento: [0],
      nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$'), Validators.minLength(5), Validators.maxLength(20)]],
      fechainicio: ['', [Validators.required]],
      fechafin: ['', [Validators.required]],
      hora: ['', Validators.required],
      ubicacion_id: [0, [Validators.required]],
      descripcion: ['', [Validators.required]],
      carrera_id: [0, [Validators.required]]
    });
  }
  Gorecursos(): void {
    this.router.navigate(['dashboard/eventos/recursos/', this.idevento]);
  }
  Gopatrocinios(): void {

    this.router.navigate(['dashboard/eventos/patrocinios', this.idevento]);
  }
  GoActividades(): void {
    this.router.navigate(['dashboard/eventos/actividades/',this.idevento]);
  }
  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.idevento = +params['idevento']; // Convierte a número
      console.log('ID de evento:', this.idevento);
    });
    this.router.events.subscribe(() => {
      Swal.close();  // 🔹 Cierra el cuadro de diálogo cuando cambia la ruta
    });
    this.get_DatosGenerales(this.idevento);
    this.getUbicaciones();
    this.permiso = Number(localStorage.getItem('permisos'))
    console.log("permiso v")
    console.log(this.permiso);
    if (this.permiso == 3) {
      this.EventoForm.controls['ubicacion_id'].disable();
    }

  }
  get_DatosGenerales(idevento: number): void {
    this.es.getEventoById(idevento).subscribe({
      next: (evento: Evento) => {
        console.log(evento);
        this.EventoForm.patchValue({
          idevento: evento.idevento,
          nombre: evento.nombre,
          fechainicio: evento.fechainicio,
          fechafin: evento.fechafin,
          hora: this.convertirHora(evento.hora),
          ubicacion_id: evento.ubicacion_id,
          descripcion: evento.descripcion,
          carrera_id: evento.carrera_id
        });
        console.log(this.EventoForm.value);
      }, error: (err) => {
        console.log("error", err);
      },
    });
  }

  getUbicaciones(): void {
    this.us.getUbicaciones().subscribe({
      next: (ubicaciones) => {
        this.ubicaciones = ubicaciones;
        console.log(this.ubicaciones);
      }, error: (err) => {
        console.log("error", err);
      },
    })
  }

  convertirHora(hora: String) {
    /*const [horas, minutos] = hora.split(':').map(Number);
    const periodo = horas >= 12 ? 'PM' : 'AM';
    const horas12 = horas % 12 || 12;  // 🔹 Convertir 00 a 12 y ajustar formato
    return `${horas12}:${minutos.toString().padStart(2, '0')} ${periodo}`;*/

    const [time, periodo] = hora.split(' ');  // 🔹 Separar `10:00` y `AM`/`PM`
    const [horas, minutos] = time.split(':').map(Number);

    // 🔹 Convertir a formato 24h
    const horas24 = periodo.toUpperCase() === 'PM' && horas !== 12 ? horas + 12 :
      horas === 12 && periodo.toUpperCase() === 'AM' ? 0 : horas;

    return `${horas24.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  }
  enviarFormulario(): void {
    if (this.EventoForm.valid) {
      console.log("entro valid form");
      const data: Evento = this.EventoForm.value;


      const convertirHora = (hora: String) => {
        const [horas, minutos] = hora.split(':').map(Number);
        const periodo = horas >= 12 ? 'PM' : 'AM';
        const horas12 = horas % 12 || 12;  // 🔹 Convertir 00 a 12 y ajustar formato
        return `${horas12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
      };

      const horaSeleccionada = data.hora;
      const horaFormateada = convertirHora(horaSeleccionada);
      data.hora = horaFormateada;

      console.log("data a enviar");
      console.log(data);

      this.es.ActualizarEvento(this.idevento, data).subscribe({
        next: () => {
          //alert("Datos Actualizados correctamente!");
          Swal.fire({
            title: '¡Guardado!',
            text: 'Evento actualizado correctamente.',
            icon: 'success',
            confirmButtonText: 'OK',
            confirmButtonColor: '#28a745'
          }).then(() => {
            location.reload();
          });
        }, error: (err) => {
          console.log("error", err)
        }
      });
    }

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
