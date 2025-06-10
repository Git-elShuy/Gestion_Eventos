import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaCarreraComponent } from './nueva-carrera.component';

describe('NuevaCarreraComponent', () => {
  let component: NuevaCarreraComponent;
  let fixture: ComponentFixture<NuevaCarreraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NuevaCarreraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaCarreraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
