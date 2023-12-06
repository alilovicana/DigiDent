import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormStatsComponent } from './form-stats.component';

describe('FormStatsComponent', () => {
  let component: FormStatsComponent;
  let fixture: ComponentFixture<FormStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormStatsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
