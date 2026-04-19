import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportPage } from './report-page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ReportPage', () => {
  let component: ReportPage;
  let fixture: ComponentFixture<ReportPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      declarations: [ReportPage]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
