import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatrocinioService } from '../patrocinio.service';
import { UsuarioService } from '../../../../usuarios/usuario.service';
import { jwtDecode } from 'jwt-decode';
import { EventoService } from '../../../evento.service';
import { Evento } from '../../../evento';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-editar-patrocinio',
  templateUrl: './editar-patrocinio.component.html',
  styleUrl: './editar-patrocinio.component.css'
})
export class EditarPatrocinioComponent implements AfterViewInit, OnInit {
  idpatrocinio!: number;
  idevento!: number;
  patrocinioForm: FormGroup;
  idcarrera!: number;
  eventos!: Evento[];
  eventoBan = false;
  origen!: string | null;

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private ps: PatrocinioService, private router: Router, private us: UsuarioService
    , private es: EventoService
  ) {
    this.patrocinioForm = this.fb.group({
      nombrePatrocinador: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$')]],
      evento_id: ['']
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
        this.idpatrocinio = +params['idpatrocinio'];
        this.idevento = +params['idevento'];
        console.log("id de patrocinio", this.idpatrocinio);
        console.log("id de evento", this.idevento);

      });
      this.route.queryParamMap.subscribe(params => {
        this.origen = params.get('origen');
        console.log("🛠 Componente invocado desde:", this.origen);
      });
      this.getPatrocinio(this.idpatrocinio);
      this.getUserCarrera(usuario.sub.matricula);
    }


  }
  getUserCarrera(matricula: String): void {
    this.us.getUserCarrera(matricula).subscribe({
      next: (carrera) => {
        this.idcarrera = carrera;
        console.log(this.idcarrera);
        this.es.getEventosByCarrera(this.idcarrera).subscribe({
          next: (eventos) => {
            this.eventos = eventos;
            console.log(eventos);
          }, error: (err) => {
            console.log("error", err)
          },
        });
      },
      error: (err) => {
        console.log("error", err);
      },
    });
  }

  getPatrocinio(idpatrocinio: number): void {
    this.ps.getPatrocinioById(idpatrocinio).subscribe({
      next: (data) => {
        console.log(data);
        this.patrocinioForm.patchValue(data);
        //this.verificarTipo();
      }, error: (err) => {
        console.log("error", err);
      },
    });
  }
  verificarTipo(): void {
    const tipoSeleccionado = this.patrocinioForm.get('tipo_patrocinio')?.value;

    if (tipoSeleccionado === 'paquete') {
      this.patrocinioForm.get('contenido_paquete')?.enable();
      this.patrocinioForm.get('contenido_paquete')?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      this.patrocinioForm.get('contenido_paquete')?.disable();
      this.patrocinioForm.get('contenido_paquete')?.clearValidators();
    }

    this.patrocinioForm.get('contenido_paquete')?.updateValueAndValidity();
  }

  enviarFormulario(): void {
    if (this.patrocinioForm.valid) {
      console.log("valido", this.patrocinioForm.value);
        this.ps.editarPatrocinio(this.idpatrocinio, this.patrocinioForm.value).subscribe({
          next: () => {
            Swal.fire({
              title: 'Operación completada',
              text: 'El proceso ha finalizado correctamente.',
              icon: 'success',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              // Redirección después de confirmar la alerta de éxito
              const rutaRedireccion = this.origen === 'recursos'
                ? '/dashboard/eventos/recursos/' + this.idevento
                : '/dashboard/eventos/patrocinios/' + this.idevento;
              this.router.navigate([rutaRedireccion]);
            });
          },
          error: (err) => {
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
