import { AfterViewInit, Component } from '@angular/core';


@Component({
  selector: 'app-registrar-evento',
  templateUrl: './registrar-evento.component.html',
  styleUrl: './registrar-evento.component.css'
})
export class RegistrarEventoComponent implements AfterViewInit {
  usuarios: { id: number, nombre: String }[] = [];
  actividades: { id: number, nombre: String }[] = [];
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

  addUsuario(): void {
    this.usuarios.push({ id: 0, nombre: '' }); // Agrega una fila vacía
  }
  removeUsuario(index: number): void {
    this.usuarios.splice(index, 1); // Elimina la fila según el índice
  }
  addActividad():void{
    this.actividades.push({id:0,nombre:''});
  }
  removeActividad(index:number):void{
    this.actividades.splice(index,1);
  }
}
