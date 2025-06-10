import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPatrocinioComponent } from './registrar-patrocinio.component';

describe('RegistrarPatrocinioComponent', () => {
  let component: RegistrarPatrocinioComponent;
  let fixture: ComponentFixture<RegistrarPatrocinioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegistrarPatrocinioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarPatrocinioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
