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
  template: `
    <section>
      <h2>StudyAssistant Dashboard</h2>
      <p>已启用用户登录、用户管理、AI 模型配置的基础骨架。</p>

      @if (!isAuthenticated()) {
        <p>当前未登录。可使用默认演示账号登录。</p>
        <p>管理员：admin / abc@123</p>
        <p>学生：student1 / abc@123</p>
        <a routerLink="/login">前往登录</a>
      }

      @if (isAuthenticated()) {
        <p>当前用户：{{ displayName() }}</p>
        @if (profile()) {
          <p>年级：{{ profile()!.grade || '未设置' }}，偏好学科：{{ profile()!.subjectPreference || '未设置' }}</p>
        }
        <button type="button" (click)="logout()">退出登录</button>
      }
    </section>
  `
})
export class HomePageComponent implements OnInit {
  readonly profile = signal<ProfileResponse | null>(null);
  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly displayName = computed(() => this.authService.session()?.displayName ?? '未登录');

  constructor(
    private readonly authService: AuthService,
    private readonly http: HttpClient,
    private readonly router: Router) {}

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
}
