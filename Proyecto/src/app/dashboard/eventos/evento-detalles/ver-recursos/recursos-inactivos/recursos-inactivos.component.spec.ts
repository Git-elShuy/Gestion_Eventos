import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursosInactivosComponent } from './recursos-inactivos.component';

describe('RecursosInactivosComponent', () => {
  let component: RecursosInactivosComponent;
  let fixture: ComponentFixture<RecursosInactivosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecursosInactivosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecursosInactivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
