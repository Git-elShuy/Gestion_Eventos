import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarPatrocinioComponent } from './recuperar-patrocinio.component';

describe('RecuperarPatrocinioComponent', () => {
  let component: RecuperarPatrocinioComponent;
  let fixture: ComponentFixture<RecuperarPatrocinioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarPatrocinioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarPatrocinioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
