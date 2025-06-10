import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPatrocinioComponent } from './editar-patrocinio.component';

describe('EditarPatrocinioComponent', () => {
  let component: EditarPatrocinioComponent;
  let fixture: ComponentFixture<EditarPatrocinioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditarPatrocinioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarPatrocinioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
