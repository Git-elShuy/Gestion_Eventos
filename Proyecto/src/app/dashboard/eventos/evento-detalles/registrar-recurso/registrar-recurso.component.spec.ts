import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarRecursoComponent } from './registrar-recurso.component';

describe('RegistrarRecursoComponent', () => {
  let component: RegistrarRecursoComponent;
  let fixture: ComponentFixture<RegistrarRecursoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarRecursoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarRecursoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
