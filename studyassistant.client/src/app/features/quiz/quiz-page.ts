import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

interface ChoiceQuestion {
  id: string;
  stem: string;
  options: string[];
  answerIndex: number;
  analysis: string;
}

interface QuizBank {
  pointId: string;
  pointName: string;
  subject: string;
  grade: string;
  questions: ChoiceQuestion[];
}

@Component({
  selector: 'app-quiz-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quiz-page.html',
  styleUrls: ['./quiz-page.css']
})
export class QuizPage {
  readonly quiz = signal<QuizBank | null>(null);
  readonly selectedAnswers = signal<Record<string, number>>({});
  readonly submitted = signal(false);
  readonly score = signal(0);

  readonly correctCount = computed(() => {
    const current = this.quiz();
    if (!current) {
      return 0;
    }

    const answers = this.selectedAnswers();
    return current.questions.filter((q) => answers[q.id] === q.answerIndex).length;
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router
  ) {
    const pointId = this.route.snapshot.paramMap.get('pointId') ?? 'func';
    this.quiz.set(this.buildQuiz(pointId));
  }

  updateAnswer(questionId: string, value: string): void {
    const next = Number(value);
    this.selectedAnswers.update((prev) => ({
      ...prev,
      [questionId]: next
    }));
  }

  submitQuiz(): void {
    const current = this.quiz();
    if (!current) {
      return;
    }

    const total = current.questions.length;
    const correct = this.correctCount();
    this.score.set(Math.round((correct / total) * 100));
    this.submitted.set(true);
  }

  retry(): void {
    this.selectedAnswers.set({});
    this.submitted.set(false);
    this.score.set(0);
  }

  backToPractice(): void {
    this.router.navigate(['/practice']);
  }

  private buildQuiz(pointId: string): QuizBank {
    const banks: QuizBank[] = [
      {
        pointId: 'func',
        pointName: '一次函数',
        subject: '数学',
        grade: '初二',
        questions: [
          {
            id: 'q1',
            stem: '已知一次函数 y = 2x + 3，当 x = -1 时，y 的值为？',
            options: ['-1', '1', '3', '5'],
            answerIndex: 1,
            analysis: '代入 x = -1，得到 y = 2 * (-1) + 3 = 1。'
          },
          {
            id: 'q2',
            stem: '函数 y = -x + 4 的斜率是？',
            options: ['4', '-1', '1', '-4'],
            answerIndex: 1,
            analysis: '一次函数 y = kx + b 中，x 的系数 k 即斜率，故为 -1。'
          },
          {
            id: 'q3',
            stem: '下列点中在函数 y = x + 2 图像上的是？',
            options: ['(0, 1)', '(1, 3)', '(2, 1)', '(-1, 0)'],
            answerIndex: 1,
            analysis: '代入 x = 1 可得 y = 3，故点 (1, 3) 在图像上。'
          }
        ]
      },
      {
        pointId: 'triangle',
        pointName: '全等三角形',
        subject: '数学',
        grade: '初二',
        questions: [
          {
            id: 'q1',
            stem: '下列条件中可判定两三角形全等的是？',
            options: ['两边及其中一边对角相等', '三边对应相等', '三角对应相等', '两角及夹边相等'],
            answerIndex: 1,
            analysis: 'SSS 判定：三边对应相等可判定两三角形全等。'
          },
          {
            id: 'q2',
            stem: '若△ABC ≌ △DEF，则对应边 AB = ?',
            options: ['DE', 'EF', 'DF', '无法确定'],
            answerIndex: 0,
            analysis: '按书写顺序 A↔D, B↔E, C↔F，所以 AB 对应 DE。'
          }
        ]
      },
      {
        pointId: 'past-tense',
        pointName: '一般过去时',
        subject: '英语',
        grade: '初二',
        questions: [
          {
            id: 'q1',
            stem: 'Yesterday, she ____ to school by bike.',
            options: ['go', 'goes', 'went', 'going'],
            answerIndex: 2,
            analysis: 'Yesterday 提示过去时间，动词用过去式 went。'
          },
          {
            id: 'q2',
            stem: 'They ____ not at home last night.',
            options: ['is', 'are', 'was', 'were'],
            answerIndex: 3,
            analysis: '主语 They 用 be 动词过去式 were。'
          }
        ]
      }
    ];

    const matched = banks.find((b) => b.pointId === pointId);
    return matched ?? banks[0];
  }
}
