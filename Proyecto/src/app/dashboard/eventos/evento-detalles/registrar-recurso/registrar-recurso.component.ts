import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatrocinioService } from '../patrocinios/patrocinio.service';
import { RecursoService } from './recurso.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-registrar-recurso',
  templateUrl: './registrar-recurso.component.html',
  styleUrl: './registrar-recurso.component.css'
})
export class RegistrarRecursoComponent implements AfterViewInit, OnInit {
  idevento!: number;
  idpatrocinio!: number;
  //permiso!:Number;
  recursoForm: FormGroup;
  patrocinios: any[] = [];
  //patrocinioForm: FormGroup;
  patrocinioBan = false;
  recurso = {
    nombre: '',
    cantidad: 0,
    es_patrocinio: false,
    idpatrocinador: '',
    idevento: 0
  }
  constructor(private route: ActivatedRoute, private router: Router, private fb: FormBuilder, private ps: PatrocinioService
    , private rs: RecursoService
  ) {
    this.recursoForm = this.fb.group({
      es_patrocinio: [false, Validators.required],  //Checkbox para indicar si es patrocinado
      recursos_array: this.fb.array([], Validators.required)
    });

  }
  addRecurso(): void {
    console.log("Intentando agregar recurso con idpatrocinio:", this.idpatrocinio);


    if (this.recursoForm.value.es_patrocinio == false) {
      const recurso = this.fb.group({
        nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$')]],
        idevento: [this.idevento, Validators.required],
        cantidad: ['', [Validators.required]],
        tipo: ['', Validators.required],
        es_patrocinado: [0, Validators.required],
        contenido_paquete: [{ value: '', disabled: true }, Validators.required],
      });
      this.RecursosArray.push(recurso);
    } else {
      if (this.idpatrocinio === 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Atención',
          text: 'Debes seleccionar un patrocinador antes de agregar un recurso.',
          confirmButtonText: 'OK',
          //confirmButtonColor: '#d33'
        });

        return; //con esto cortamos la ejecucion del codigo
      }
      const recurso = this.fb.group({
        nombre: ['', [Validators.required, Validators.pattern('^(?!\\s*$)[a-zA-Z0-9\\s-]*[a-zA-Z0-9]+$')]],
        idevento: [this.idevento, Validators.required],
        cantidad: ['', [Validators.required]],
        tipo: ['', Validators.required],
        es_patrocinado: [this.idpatrocinio, Validators.required],
        contenido_paquete: [{ value: '', disabled: true }, Validators.required],
      });
      this.RecursosArray.push(recurso);
    }










  }
  seleccionarPatrocinio(event: any): void {
    const idseleccionado = event.target.value;
    const target = event.target as HTMLSelectElement;
    this.idpatrocinio = Number(target.value);
    this.recursoForm.patchValue({
      es_patrocinado: this.idpatrocinio
    });
    console.log("Patrocinador seleccionado:", this.idpatrocinio);
    /*if (idseleccionado === "") {
      this.recursoForm.patchValue({
        es_patrocinado: 0
      });
    } else {
      const patrocinioSeleccionado = this.patrocinios.find(p => p.idpatrocinio == idseleccionado);
      if (patrocinioSeleccionado) {
        this.idpatrocinio = patrocinioSeleccionado.idpatrocinio;
        console.log("patrocinio seleccionado: ", patrocinioSeleccionado);
        this.recursoForm.patchValue({
          es_patrocinado: patrocinioSeleccionado.idpatrocinio
        });

      }
    }*/

  }
  removeRecurso(index: number) {
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
    //this.RecursosArray.removeAt(index);
  }
  get RecursosArray(): FormArray {
    return this.recursoForm.get('recursos_array') as FormArray;
  }
  GoDatosGenerales(): void {
    this.router.navigate(['dashboard/eventos/detalles', this.idevento]);
  }
  GoPatrocinios(): void {
    this.router.navigate(['dashboard/eventos/patrocinios', this.idevento]);
  }
  GoActividades(): void {
    this.router.navigate(['dashboard/eventos/registrar_actividad/', this.idevento]);
  }
  enviarFormulario(): void {
    if (this.recursoForm.value.es_patrocinio == false) {
      // console.log("entroooo")
      //this.recursoForm.value.idevento = this.idevento;
      //this.recursoForm.value.idpatrocinador = 0;
      this.recursoForm.patchValue({
        idevento: this.idevento,
        es_patrocinado: 0
      });
      //console.log(this.recursoForm.value)
      if (this.recursoForm.valid) {
        //console.log("entro valid 1")
        console.log(this.recursoForm.value)
        this.rs.crearRecurso(this.recursoForm.value).subscribe({
          next: () => {
            //alert("Recurso creado con exito")
            Swal.fire({
              title: '¡Guardado!',
              text: 'Recurso creado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745'
            }).then(() => {
              this.router.navigate(['dashboard/eventos/detalles', this.idevento]);
            });

          }, error: (err) => {
            console.log("error", err);
          },
        });
      }
    } else {
      this.recursoForm.patchValue({
        idevento: this.idevento
      });
      if (this.recursoForm.valid) {

        console.log(this.recursoForm.value)
        this.rs.crearRecurso(this.recursoForm.value).subscribe({
          next: () => {
            //alert("Recurso creado con exito")
            Swal.fire({
              title: '¡Guardado!',
              text: 'Recurso creado correctamente.',
              icon: 'success',
              confirmButtonText: 'OK',
              confirmButtonColor: '#28a745'
            }).then(() => {
              this.router.navigate(['dashboard/eventos/detalles', this.idevento]);
            });
            //this.router.navigate(['dashboard/eventos/detalles', this.idevento]);
          }, error: (err) => {
            console.log("error", err);
          },
        });


      }
    }



  }
  /*validarPatrocinio(idpatrocinio: number): void {
    console.log(idpatrocinio);
    this.ps.validar_cambioPatrocinio(idpatrocinio).subscribe({
      next: (data) => {
        if (data.asignado) {
          this.patrocinioBan = true;

        }
      }, error: (err) => {
        console.log("error", err)
      },
    });
  }*/
  ngOnInit(): void {
    // Capturar el ID de la URL
    this.route.params.subscribe(params => {
      this.idevento = +params['idevento']; // Convierte a número
      console.log('ID de evento:', this.idevento);
    });
    this.router.events.subscribe(() => {
      Swal.close();  // 🔹 Cierra el cuadro de diálogo cuando cambia la ruta
    });
    this.recursoForm.get('es_patrocinio')?.valueChanges.subscribe(valor => {
      console.log(`🔄 Estado del checkbox:`, valor ? "✅ Marcado (true)" : "❌ No marcado (false)");

      if (valor) {
        this.idpatrocinio = 0;
        this.RecursosArray.clear();
        console.log("✅ El usuario ha marcado patrocinio.");
        /* this.recursoForm.patchValue({
           nombre: '',
           idevento: '',
           cantidad: '',
           tipo: '',
           //idpatrocinador: '',
           contenido_paquete: [{ value: '', disabled: true }],
 
         });*/
        //this.PatrociniosArray.reset();
        //this.RecursosArray.reset();
        if (this.patrocinios.length <= 0) {
          this.getPatrocinios();
        }



      } else {
        this.idpatrocinio = 0;
        this.RecursosArray.clear();
        console.log("❌ El usuario ha desmarcado patrocinio.");

        /*this.recursoForm.patchValue({
          nombre: '',
          idevento: '',
          cantidad: '',
          tipo: '',
          //sidpatrocinador: '',
          contenido_paquete: [{ value: '', disabled: true }],
        });*/
        //this.PatrociniosArray.reset();
      }
    });


    //this.permiso = Number(localStorage.getItem('permisos'))

  }
  verificarTipo(index: number): void {
    const tipoSeleccionado = this.recursoForm.get('tipo')?.value;
    const recurso = this.RecursosArray.at(index) as FormGroup;
    if (recurso.get('tipo')?.value === 'paquete') {
      recurso.get('contenido_paquete')?.enable();
      recurso.get('contenido_paquete')?.setValidators([Validators.required, Validators.min(1)]);
    } else {
      this.recursoForm.get('contenido_paquete')?.disable();
      this.recursoForm.get('contenido_paquete')?.clearValidators();
    }

    //this.recursoForm.get('contenido_paquete')?.updateValueAndValidity();
    recurso.get('contenido_paquete')?.updateValueAndValidity();
  }
  getPatrocinios(): void {
    this.ps.getPatrocinios(this.idevento).subscribe({
      next: (data) => {
        console.log("✅ Patrocinios obtenidos:", data);
        this.patrocinios = data;
        /*const patrocinioArray = this.recursoForm.get('patrocinioForm') as FormArray;
        patrocinioArray.clear();  // nos aseguramos que el array este vacio

        data.forEach((p: any) => {
          patrocinioArray.push(this.fb.group({
            idpatrocinio: [p.idpatrocinio],
            nombrePatrocinador: [p.nombrePatrocinador],
            evento_id: [p.evento_id],
            nombreRecurso: [p.nombreRecurso],
            cantidad: [p.cantidad],
            eliminar: [p.eliminar],
            tipo_patrocinio: [p.tipo_patrocinio],
            contenido_paquete: [p.contenido_paquete]
          }));
        });


        console.log("🎯 Datos actuales en patrocinioForm:", patrocinioArray.value);*/
      },
      error: (err) => console.log("❌ Error al obtener patrocinios", err)
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
