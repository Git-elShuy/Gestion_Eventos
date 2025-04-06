import { Component, AfterViewInit, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit, OnInit {
  index:number=0;
  titulo:String="";
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
      this.setIndex(-1);
  }

  setIndex(value:number){

    switch(value) {
      case -1:{
        this.titulo="HOME";
        break;
      }
      case 6: {
        this.titulo = "Nuevo Usuario";
        break; 
      }
      default: {
        this.titulo = "HOME"
      }
    }
    

    this.index=value;
  }
}
