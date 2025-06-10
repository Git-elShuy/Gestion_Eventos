import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarCarreraComponent } from './recuperar-carrera.component';

describe('RecuperarCarreraComponent', () => {
  let component: RecuperarCarreraComponent;
  let fixture: ComponentFixture<RecuperarCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarCarreraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
