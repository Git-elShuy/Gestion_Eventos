import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarUbicacionComponent } from './recuperar-ubicacion.component';

describe('RecuperarUbicacionComponent', () => {
  let component: RecuperarUbicacionComponent;
  let fixture: ComponentFixture<RecuperarUbicacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarUbicacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarUbicacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
