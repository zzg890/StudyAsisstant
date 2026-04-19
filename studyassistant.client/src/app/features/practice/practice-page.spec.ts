import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticePage } from './practice-page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('PracticePage', () => {
  let component: PracticePage;
  let fixture: ComponentFixture<PracticePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PracticePage, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              queryParamMap: convertToParamMap({})
            }
          }
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
