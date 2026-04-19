import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-page',
  standalone: true,
  templateUrl: './report-page.html',
  styleUrls: ['./report-page.css']
})
export class ReportPage {
  taskId: string | null = null;
  constructor(private route: ActivatedRoute) {
    this.taskId = this.route.snapshot.paramMap.get('taskId');
  }
}
