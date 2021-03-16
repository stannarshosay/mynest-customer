import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportVendorComponent } from './report-vendor.component';

describe('ReportVendorComponent', () => {
  let component: ReportVendorComponent;
  let fixture: ComponentFixture<ReportVendorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportVendorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
