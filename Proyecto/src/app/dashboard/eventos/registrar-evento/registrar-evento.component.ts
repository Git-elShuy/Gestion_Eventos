import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'app-registrar-evento',
  templateUrl: './registrar-evento.component.html',
  styleUrl: './registrar-evento.component.css'
})
export class RegistrarEventoComponent implements AfterViewInit, OnInit {
  //usuarios: { id: number, nombre: string }[] = [];
  //actividades: { id: number, nombre: string }[] = [];
  eventoForm: FormGroup;

  constructor(private fb: FormBuilder) {

    this.eventoForm = this.fb.group({
      nombre: ['', [Validators.required]],
      fecha1: ['', [Validators.required]],
      fecha2: ['', [Validators.required]],
      hora:['',[Validators.required]],
      lugar: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      actividades: this.fb.array([]),
      usuarios: this.fb.array([])
    })
  }
  ngOnInit(): void {

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
  
  get organizadores(): FormArray {
    return this.usuariosArray;
  }
  

  addUsuario(): void {
    //this.usuarios.push({ id: 0, nombre: '' }); // Agrega una fila vacía
    const usuario = this.fb.group({
      nombreUsuario:['',[Validators.required]],
      rolUsuario:['',[Validators.required]],

    })
    //this.usuariosArray.push(this.fb.control('', Validators.required))
    this.usuariosArray.push(usuario);
  }
  removeUsuario(index: number): void {
    //this.usuarios.splice(index, 1); // Elimina la fila según el índice
    this.usuariosArray.removeAt(index);
  }
  addActividad(): void {
    //this.actividades.push({id:0,nombre:''});
    //this.actividades.push(this.fb.control(''));
    const actividad = this.fb.group({
      nombreActividad:['',[Validators.required]],
      fechaActividad:['',[Validators.required]],
      horaActividad:['',[Validators.required]],
      lugarActividad:['',[Validators.required]],
      responsableActividad:['',[Validators.required]]

    })
    //this.actividadesArray.push(this.fb.control('', Validators.required));
    this.actividadesArray.push(actividad);

  }
  removeActividad(index: number): void {
    //this.actividades.splice(index,1);
    this.actividadesArray.removeAt(index);
  }
  enviarFormulario(): void {

  }
}
