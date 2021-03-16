import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostRequirementComponent } from './post-requirement.component';

describe('PostRequirementComponent', () => {
  let component: PostRequirementComponent;
  let fixture: ComponentFixture<PostRequirementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostRequirementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PostRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
