import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecuperarLugarComponent } from './recuperar-lugar.component';

describe('RecuperarLugarComponent', () => {
  let component: RecuperarLugarComponent;
  let fixture: ComponentFixture<RecuperarLugarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecuperarLugarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecuperarLugarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
