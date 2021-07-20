import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidersListSubComponent } from './providers-list-sub.component';

describe('ProvidersListSubComponent', () => {
  let component: ProvidersListSubComponent;
  let fixture: ComponentFixture<ProvidersListSubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProvidersListSubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvidersListSubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
