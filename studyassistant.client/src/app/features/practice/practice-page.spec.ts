import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PracticePage } from './practice-page';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('PracticePage', () => {
  let component: PracticePage;
  let fixture: ComponentFixture<PracticePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [PracticePage]
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
