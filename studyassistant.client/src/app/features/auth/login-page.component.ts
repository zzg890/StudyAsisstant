import { HttpClient } from '@angular/common/http';
import { Component, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService, AuthSession } from './auth.service';

interface LoginResponse {
  token: string;
  userName: string;
  role: string;
  displayName: string;
}

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section>
      <h2>用户登录</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>
          用户名
          <input type="text" formControlName="userName" />
        </label>
        <label>
          密码
          <input type="password" formControlName="password" />
        </label>
        <button type="submit" [disabled]="isLoading()">登录</button>
      </form>

      @if (errorMessage()) {
        <p>{{ errorMessage() }}</p>
      }

      @if (loginResult()) {
        <p>登录成功：{{ loginResult()!.displayName }} ({{ loginResult()!.role }})</p>
      }
    </section>
  `
})
export class LoginPageComponent {
  readonly isLoading = signal(false);
  readonly errorMessage = signal('');
  readonly loginResult = signal<LoginResponse | null>(null);
  readonly form;

  constructor(
    private readonly fb: FormBuilder,
    private readonly http: HttpClient,
    private readonly authService: AuthService,
    private readonly router: Router) {
    this.form = this.fb.nonNullable.group({
      userName: ['', [Validators.required, Validators.maxLength(64)]],
      password: ['', [Validators.required, Validators.maxLength(128)]]
    });
  }

  async submit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    try {
      const result = await firstValueFrom(
        this.http.post<LoginResponse>('/api/auth/login', this.form.getRawValue())
      );
      this.loginResult.set(result);
      this.authService.setSession(result as AuthSession);
      await this.router.navigateByUrl(result.role === 'Admin' ? '/admin/users' : '/');
    } catch {
      this.errorMessage.set('登录失败，请检查用户名或密码。');
      this.loginResult.set(null);
    } finally {
      this.isLoading.set(false);
    }
  }
}
