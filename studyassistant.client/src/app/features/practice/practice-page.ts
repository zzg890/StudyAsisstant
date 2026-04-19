import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

interface KnowledgePoint {
  id: string;
  name: string;
  subject: string;
  grade: string;
}

@Component({
  selector: 'app-practice-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './practice-page.html',
  styleUrls: ['./practice-page.css']
})
export class PracticePage {
  subject = '数学';
  grade = '初二';
  knowledgePoints: KnowledgePoint[] = [
    { id: 'func', name: '一次函数', subject: '数学', grade: '初二' },
    { id: 'triangle', name: '全等三角形', subject: '数学', grade: '初二' },
    { id: 'fraction', name: '分式方程', subject: '数学', grade: '初二' },
    { id: 'past-tense', name: '一般过去时', subject: '英语', grade: '初二' },
    { id: 'reading', name: '阅读主旨判断', subject: '英语', grade: '初二' }
  ];

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute
  ) {
    const querySubject = this.route.snapshot.queryParamMap.get('subject');
    const queryGrade = this.route.snapshot.queryParamMap.get('grade');
    const queryPoint = this.route.snapshot.queryParamMap.get('point');

    if (querySubject) {
      this.subject = querySubject;
    }

    if (queryGrade) {
      this.grade = queryGrade;
    }

    if (queryPoint) {
      const matched = this.knowledgePoints.find((kp) => kp.name === queryPoint);
      if (matched) {
        this.subject = matched.subject;
        this.grade = matched.grade;
      }
    }
  }

  get filteredPoints() {
    return this.knowledgePoints.filter(kp => kp.subject === this.subject && kp.grade === this.grade);
  }

  startPractice(point: KnowledgePoint) {
    this.router.navigate(['/quiz', point.id]);
  }
}
