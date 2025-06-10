import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerActividadesComponent } from './ver-actividades.component';

describe('VerActividadesComponent', () => {
  let component: VerActividadesComponent;
  let fixture: ComponentFixture<VerActividadesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerActividadesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerActividadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
