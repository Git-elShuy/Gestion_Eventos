import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerRecursosComponent } from './ver-recursos.component';

describe('VerRecursosComponent', () => {
  let component: VerRecursosComponent;
  let fixture: ComponentFixture<VerRecursosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VerRecursosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerRecursosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
