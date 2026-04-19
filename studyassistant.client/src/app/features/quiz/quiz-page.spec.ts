import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuizPage } from './quiz-page';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('QuizPage', () => {
  let component: QuizPage;
  let fixture: ComponentFixture<QuizPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, FormsModule],
      declarations: [QuizPage]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuizPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
