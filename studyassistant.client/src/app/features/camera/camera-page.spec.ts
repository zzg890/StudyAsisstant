import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CameraPage } from './camera-page';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('CameraPage', () => {
  let component: CameraPage;
  let fixture: ComponentFixture<CameraPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [CameraPage]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CameraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
