import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewQoutesComponent } from './view-qoutes.component';

describe('ViewQoutesComponent', () => {
  let component: ViewQoutesComponent;
  let fixture: ComponentFixture<ViewQoutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewQoutesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewQoutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
