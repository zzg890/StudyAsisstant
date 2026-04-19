import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface AiModelItem {
  id: number;
  name: string;
  provider: string;
  modelName: string;
  scenario: string;
  temperature: number;
  maxTokens: number;
  priority: number;
  isActive: boolean;
}

@Component({
  selector: 'app-ai-model-config-page',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <section>
      <h2>AI 模型配置</h2>
      <button type="button" (click)="loadConfigs()">刷新配置</button>

      <form [formGroup]="form" (ngSubmit)="createConfig()">
        <h3>新增配置</h3>
        <input type="text" placeholder="配置名称" formControlName="name" />
        <input type="text" placeholder="Provider" formControlName="provider" />
        <input type="text" placeholder="Model Name" formControlName="modelName" />
        <input type="text" placeholder="Scenario" formControlName="scenario" />
        <input type="number" placeholder="Temperature" formControlName="temperature" />
        <input type="number" placeholder="Max Tokens" formControlName="maxTokens" />
        <button type="submit">保存</button>
      </form>

      @if (message()) {
        <p>{{ message() }}</p>
      }

      <ul>
        @for (item of configs(); track item.id) {
          <li>
            <strong>{{ item.name }}</strong>
            <span> - {{ item.provider }}/{{ item.modelName }} - 场景: {{ item.scenario }}</span>
          </li>
        }
      </ul>
    </section>
  `
})
export class AiModelConfigPageComponent implements OnInit {
  readonly configs = signal<AiModelItem[]>([]);
  readonly message = signal('');
  readonly form;

  constructor(private readonly http: HttpClient, private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.maxLength(64)]],
      provider: ['', [Validators.required, Validators.maxLength(32)]],
      modelName: ['', [Validators.required, Validators.maxLength(128)]],
      baseUrl: [''],
      apiKey: [''],
      scenario: ['general', [Validators.required, Validators.maxLength(64)]],
      temperature: [0.2, [Validators.required, Validators.min(0), Validators.max(2)]],
      maxTokens: [1024, [Validators.required, Validators.min(1), Validators.max(32768)]],
      priority: [0, [Validators.required]],
      isActive: [true, [Validators.required]]
    });
  }

  async ngOnInit(): Promise<void> {
    await this.loadConfigs();
  }

  async loadConfigs(): Promise<void> {
    this.message.set('');
    try {
      const result = await firstValueFrom(this.http.get<AiModelItem[]>('/api/admin/ai-model-configs'));
      this.configs.set(result ?? []);
    } catch {
      this.message.set('加载模型配置失败，请先以管理员账号登录。');
    }
  }

  async createConfig(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.message.set('');
    try {
      await firstValueFrom(this.http.post('/api/admin/ai-model-configs', this.form.getRawValue()));
      this.message.set('模型配置保存成功。');
      await this.loadConfigs();
    } catch {
      this.message.set('保存模型配置失败。');
    }
  }
}
