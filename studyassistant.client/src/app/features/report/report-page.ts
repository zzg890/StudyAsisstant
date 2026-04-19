import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';

interface WeakKnowledgePointItem {
  name: string;
  accuracyRate: number;
  wrongQuestionCount: number;
  suggestion: string;
}

interface HomeworkAnalysisResultResponse {
  taskId: string;
  status: string;
  subject: string;
  grade: string;
  recognizedQuestionCount: number;
  correctRate: number;
  weakKnowledgePoints: WeakKnowledgePointItem[];
  recommendedActions: string[];
  summary: string;
  generatedAtUtc: string;
}

@Component({
  selector: 'app-report-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './report-page.html',
  styleUrls: ['./report-page.css']
})
export class ReportPage implements OnInit {
  readonly loading = signal(true);
  readonly loadError = signal('');
  readonly result = signal<HomeworkAnalysisResultResponse | null>(null);
  taskId = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly http: HttpClient
  ) {}

  async ngOnInit(): Promise<void> {
    this.taskId = this.route.snapshot.paramMap.get('taskId') ?? '';
    const isPreview = this.taskId === 'preview';
    const isGuidLike = /^[0-9a-fA-F-]{36}$/.test(this.taskId);

    if (!this.taskId || (!isPreview && !isGuidLike)) {
      this.loading.set(false);
      this.loadError.set('无效的任务 ID。');
      return;
    }

    if (isPreview) {
      this.result.set(this.buildPreviewResult());
      this.loading.set(false);
      return;
    }

    try {
      const data = await firstValueFrom(
        this.http.get<HomeworkAnalysisResultResponse>(`/api/homework-analyses/${this.taskId}`)
      );
      this.result.set(data);
    } catch (error: any) {
      this.loadError.set(error?.error?.message || '报告加载失败，请稍后重试。');
      this.result.set(null);
    } finally {
      this.loading.set(false);
    }
  }

  percent(value: number): number {
    return Math.round(value * 100);
  }

  private buildPreviewResult(): HomeworkAnalysisResultResponse {
    return {
      taskId: 'preview',
      status: 'Completed',
      subject: '数学',
      grade: '初二',
      recognizedQuestionCount: 12,
      correctRate: 0.67,
      weakKnowledgePoints: [
        {
          name: '一次函数',
          accuracyRate: 0.45,
          wrongQuestionCount: 4,
          suggestion: '先复习斜率与截距定义，再完成 5 道同类基础题。'
        },
        {
          name: '全等三角形',
          accuracyRate: 0.58,
          wrongQuestionCount: 3,
          suggestion: '重点辨析判定条件，整理典型题型到错题本。'
        }
      ],
      recommendedActions: [
        '优先完成数学薄弱知识点专项练习。',
        '根据错题自动生成复习笔记并在 24 小时内回顾一次。',
        '连续 3 天跟踪同知识点正确率变化。'
      ],
      summary: '示例报告：已识别 12 题，当前薄弱点集中在一次函数、全等三角形。',
      generatedAtUtc: new Date().toISOString()
    };
  }
}
