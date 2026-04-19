import { HttpClient } from '@angular/common/http';
import { Component, OnInit, computed, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../auth/auth.service';

interface ProfileResponse {
  id: number;
  userName: string;
  role: string;
  displayName: string;
  grade: string;
  subjectPreference: string;
}

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent implements OnInit {
  readonly stats = [
    { label: '本周正确率', value: '87%', tag: '+12%', tone: 'green' },
    { label: '已完成题目', value: '156', tag: '本周', tone: 'blue' },
    { label: '学习时长', value: '2.5h', tag: '今日', tone: 'purple' },
    { label: '学习连续', value: '7天', tag: '连续', tone: 'orange' }
  ];

  readonly weakPoints = [
    { id: 'func', title: '一次函数', grade: '初二 · 数学', accuracy: 45, wrongCount: 12 },
    { id: 'triangle', title: '全等三角形', grade: '初二 · 数学', accuracy: 58, wrongCount: 8 },
    { id: 'fraction', title: '分式方程', grade: '初二 · 数学', accuracy: 63, wrongCount: 6 }
  ];

  readonly profile = signal<ProfileResponse | null>(null);
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly displayName = computed(() => this.authService.session()?.displayName ?? '未登录');
  readonly greeting = computed(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return '早上好';
    }

    if (hour < 18) {
      return '下午好';
    }

    return '晚上好';
  });

  constructor(
    private readonly authService: AuthService,
    private readonly http: HttpClient,
    private readonly router: Router) { }

  async ngOnInit(): Promise<void> {
    if (!this.authService.isAuthenticated()) {
      return;
    }

    try {
      const result = await firstValueFrom(this.http.get<ProfileResponse>('/api/users/me'));
      this.profile.set(result);
    } catch {
      this.authService.logout();
      this.profile.set(null);
    }
  }

  logout(): void {
    this.authService.logout();
    this.profile.set(null);
    void this.router.navigateByUrl('/login');
  }

  accuracyTone(accuracy: number): 'danger' | 'warning' | 'good' {
    if (accuracy < 50) {
      return 'danger';
    }

    if (accuracy < 70) {
      return 'warning';
    }

    return 'good';
  }
}
