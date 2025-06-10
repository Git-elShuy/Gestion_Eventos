import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarUbicacionComponent } from './editar-ubicacion.component';

describe('EditarUbicacionComponent', () => {
  let component: EditarUbicacionComponent;
  let fixture: ComponentFixture<EditarUbicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarUbicacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
