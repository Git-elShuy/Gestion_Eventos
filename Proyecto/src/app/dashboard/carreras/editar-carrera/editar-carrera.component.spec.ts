import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarCarreraComponent } from './editar-carrera.component';

describe('EditarCarreraComponent', () => {
  let component: EditarCarreraComponent;
  let fixture: ComponentFixture<EditarCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarCarreraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
