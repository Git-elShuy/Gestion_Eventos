import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import 'datatables.net';
import $ from 'jquery';




@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent implements AfterViewInit, OnInit {
  constructor(private router: Router){

  }
  ngOnInit(): void {
      
  }

  ngAfterViewInit(): void {
    this.initDataTable();
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
  initDataTable(): void {
    const that = this;
    if ($.fn.DataTable.isDataTable('#miTabla')) {
      $('#miTabla').DataTable().destroy(true); // Destruye la tabla actual
    }
    $('#miTabla').DataTable({
      language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        search: "Buscar:",
        info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
        paginate: {
          first: "Primero",
          last: "Último",
          next: "Siguiente",
          previous: "Anterior"
        }
      },
      initComplete: function () {
        // Encuentra el contenedor del filtro y agrega el botón
        const filterContainer = $('.dt-search');
        const btn = $('<i class="lni lni-plus ms-2" role="button"></i>');
        filterContainer.append(btn);
        btn.on('click',function(){
          //alert("boton click");
          that.router.navigate(["dashboard/eventos/registrar"]);
          
        });
      }
    });
  }



}
