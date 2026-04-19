import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface UserItem {
  id: number;
  userName: string;
  role: string;
  displayName: string;
  grade: string;
  subjectPreference: string;
  isActive: boolean;
}

@Component({
  selector: 'app-user-management-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section>
      <h2>用户管理</h2>
      <button type="button" (click)="loadUsers()">刷新列表</button>

      <form [formGroup]="createForm" (ngSubmit)="createUser()">
        <h3>新增用户</h3>
        <input type="text" placeholder="用户名" formControlName="userName" />
        <input type="password" placeholder="初始密码" formControlName="password" />
        <input type="text" placeholder="显示名" formControlName="displayName" />
        <input type="text" placeholder="角色(默认 Student)" formControlName="role" />
        <button type="submit">创建</button>
      </form>

      @if (message()) {
        <p>{{ message() }}</p>
      }

      <ul>
        @for (user of users(); track user.id) {
          <li>
            <strong>{{ user.userName }}</strong>
            <span> - {{ user.displayName }} - {{ user.role }} - {{ user.isActive ? '启用' : '禁用' }}</span>
            <button type="button" (click)="toggleStatus(user)">
              {{ user.isActive ? '禁用' : '启用' }}
            </button>
          </li>
        }
      </ul>
    </section>
  `
})
export class UserManagementPageComponent implements OnInit {
  readonly users = signal<UserItem[]>([]);
  readonly message = signal('');
  readonly createForm;

  constructor(private readonly http: HttpClient, private readonly fb: FormBuilder) {
    this.createForm = this.fb.nonNullable.group({
      userName: ['', [Validators.required, Validators.maxLength(64)]],
      password: ['', [Validators.required, Validators.maxLength(128)]],
      displayName: ['', [Validators.required, Validators.maxLength(64)]],
      role: ['Student', [Validators.required, Validators.maxLength(32)]]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadUsers();
  }

  async loadUsers(): Promise<void> {
    this.message.set('');
    try {
      const result = await firstValueFrom(this.http.get<UserItem[]>('/api/users'));
      this.users.set(result ?? []);
    } catch {
      this.message.set('加载用户失败，请先以管理员账号登录。');
    }
  }

  async createUser(): Promise<void> {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.message.set('');
    try {
      await firstValueFrom(this.http.post('/api/users', this.createForm.getRawValue()));
      this.message.set('用户创建成功。');
      await this.loadUsers();
    } catch {
      this.message.set('创建失败，请检查权限或输入。');
    }
  }

  async toggleStatus(user: UserItem): Promise<void> {
    this.message.set('');
    try {
      await firstValueFrom(this.http.patch(`/api/users/${user.id}/status`, { isActive: !user.isActive }));
      await this.loadUsers();
    } catch {
      this.message.set('更新用户状态失败。');
    }
  }
}
