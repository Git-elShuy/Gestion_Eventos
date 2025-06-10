import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { UbicacionesService } from '../../ubicaciones/ubicaciones.service';
import { Ubicacion } from '../../ubicaciones/ubicacion';
import { Evento } from '../evento';
import { EventoService } from '../evento.service';
import { jwtDecode } from 'jwt-decode';
import { UsuarioService } from '../../usuarios/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
@Component({
  selector: 'app-registrar-evento',
  templateUrl: './registrar-evento.component.html',
  styleUrl: './registrar-evento.component.css'
})
export class RegistrarEventoComponent implements AfterViewInit, OnInit {
  ubicaciones!: Ubicacion[];
  eventoForm: FormGroup;
  //idpermiso!: Number;
  idcarrera!: number;
  matricula !: String;
  constructor(private fb: FormBuilder, private us: UbicacionesService, private es: EventoService, private userService: UsuarioService, private router: Router) {

    this.eventoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$'), Validators.minLength(5), Validators.maxLength(20)]],
      fechainicio: ['', [Validators.required]],
      fechafin: ['', [Validators.required]],
      hora: ['', [Validators.required]],
      ubicacion_id: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      carrera_id: [0, [Validators.required]],
      //actividades: this.fb.array([]),
      //usuarios: this.fb.array([])
    });
  }
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.router.events.subscribe(() => {
        Swal.close();
      });
      this.getUbicaciones();
      const usuario: any = jwtDecode(token);
      this.matricula = usuario.sub.matricula;
      this.userService.getUserCarrera(this.matricula).subscribe({
        next: (idcarrera) => {
          this.idcarrera = idcarrera;
          console.log("idcarrera: v")
          console.log(idcarrera);
        }, error: (err) => {
          console.log("err", err);
        },
      });
    }
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

  get actividadesArray(): FormArray {
    return this.eventoForm.get('actividades') as FormArray;
  }
  get usuariosArray(): FormArray {
    return this.eventoForm.get('usuarios') as FormArray;
  }
  /*get actividades(): FormArray {
    return this.actividadesArray;
  }*/



  addUsuario(): void {

    /*const usuario = this.fb.group({
      nombreUsuario:['',[Validators.required]],
      rolUsuario:['',[Validators.required]],

    })
 
    this.usuariosArray.push(usuario);*/
  }
  removeUsuario(index: number): void {
    //this.usuarios.splice(index, 1); // Elimina la fila según el índice
    //this.usuariosArray.removeAt(index);
  }
  addActividad(): void {

    /*const actividad = this.fb.group({
      nombreActividad:['',[Validators.required]],
      fechaActividad:['',[Validators.required]],
      horaActividad:['',[Validators.required]],
      lugarActividad:['',[Validators.required]],
      responsableActividad:['',[Validators.required]]

    })

    this.actividadesArray.push(actividad);*/

  }
  removeActividad(index: number): void {

    //this.actividadesArray.removeAt(index);
  }
  enviarFormulario(): void {
    if (this.eventoForm.valid) {
      /*this.userService.getUserCarrera(this.matricula).subscribe({
        next: (idcarrera) => {
          this.idcarrera = idcarrera;
          console.log("idcarrera: v")
          console.log(idcarrera);
        }, error: (err) => {
          console.log("err", err);
        },
      });*/
      const data: Evento = this.eventoForm.value;
      data.carrera_id = this.idcarrera;
      console.log(data);
      //console.log(horaSeleccionada);
      const convertirHora = (hora: String) => {
        const [horas, minutos] = hora.split(':').map(Number);
        const periodo = horas >= 12 ? 'PM' : 'AM';
        const horas12 = horas % 12 || 12;  // 🔹 Convertir 00 a 12 y ajustar formato
        return `${horas12}:${minutos.toString().padStart(2, '0')} ${periodo}`;
      };
      const horaSeleccionada = data.hora;
      const horaFormateada = convertirHora(horaSeleccionada);
      data.hora = horaFormateada;

      this.es.nuevoEvento(data).subscribe({
        next: () => {
          //alert("Evento creado con exito");
          Swal.fire({
            title: '¡Operación exitosa!',
            text: 'El proceso se completó correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#28a745'
          }).then((result) => {
            if (result.isConfirmed) {
              location.reload();
            }
          });

        }, error: (err) => {
          console.log("error", err);
        },
      });

    }
  }
}
