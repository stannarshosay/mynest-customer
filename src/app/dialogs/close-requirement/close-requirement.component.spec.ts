import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseRequirementComponent } from './close-requirement.component';

describe('CloseRequirementComponent', () => {
  let component: CloseRequirementComponent;
  let fixture: ComponentFixture<CloseRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
