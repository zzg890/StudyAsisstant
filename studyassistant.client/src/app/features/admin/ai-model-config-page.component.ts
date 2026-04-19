import { HttpClient } from '@angular/common/http';
import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

interface AiModelItem {
  id: number;
  name: string;
  provider: string;
  modelName: string;
  baseUrl: string;
  apiKey: string;
  scenario: string;
  temperature: number;
  maxTokens: number;
  priority: number;
  isActive: boolean;
}

import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-ai-model-config-page',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  styleUrls: ['./ai-model-config-page.component.css'],
  template: `
    <section class="ai-model-config-page">
      <h2>AI模型配置</h2>
      <button type="button" (click)="loadConfigs()">刷新配置</button>
      <button type="button" class="action-btn" (click)="openModal()">新增配置</button>

      <div *ngIf="message()" style="margin:0.7rem 0;color:#b91c1c;">{{ message() }}</div>

      <table class="model-table">
        <thead>
          <tr>
            <th>名称</th><th>Provider</th><th>Model</th><th>BaseUrl</th><th>ApiKey</th><th>场景</th><th>温度</th><th>MaxTokens</th><th>优先级</th><th>状态</th><th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of configs()">
            <td>{{ item.name }}</td>
            <td>{{ item.provider }}</td>
            <td>{{ item.modelName }}</td>
            <td>{{ item.baseUrl }}</td>
            <td>{{ item.apiKey ? '******' : '' }}</td>
            <td>{{ item.scenario }}</td>
            <td>{{ item.temperature }}</td>
            <td>{{ item.maxTokens }}</td>
            <td>{{ item.priority }}</td>
            <td>
              <span [class.status-active]="item.isActive" [class.status-inactive]="!item.isActive">
                {{ item.isActive ? '启用' : '禁用' }}
              </span>
            </td>
            <td>
              <button class="action-btn" (click)="editConfig(item)">编辑</button>
              <button class="action-btn" (click)="toggleActive(item)">{{ item.isActive ? '禁用' : '启用' }}</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="modal-mask" *ngIf="showModal">
        <div class="modal-box">
          <form [formGroup]="form" (ngSubmit)="createConfig()">
            <h3>{{ editingId ? '编辑配置' : '新增配置' }}</h3>
            <label>名称<input type="text" formControlName="name" /></label>
            <label>Provider<input type="text" formControlName="provider" /></label>
            <label>Model Name<input type="text" formControlName="modelName" /></label>
            <label>BaseUrl<input type="text" formControlName="baseUrl" /></label>
            <label>ApiKey<input type="text" formControlName="apiKey" /></label>
            <label>场景<input type="text" formControlName="scenario" /></label>
            <label>Temperature<input type="number" formControlName="temperature" step="0.01" /></label>
            <label>Max Tokens<input type="number" formControlName="maxTokens" /></label>
            <label>优先级<input type="number" formControlName="priority" /></label>
            <label>启用
              <input type="checkbox" formControlName="isActive" />
            </label>
            <div class="modal-actions">
              <button type="submit">保存</button>
              <button type="button" (click)="closeModal()">取消</button>
            </div>
          </form>
        </div>
      </div>
    </section>
  `
})
export class AiModelConfigPageComponent implements OnInit {
  readonly configs = signal<AiModelItem[]>([]);
  readonly message = signal('');
  readonly form;
  showModal = false;
  public editingId: number|null = null;

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
      const result = await firstValueFrom(this.http.get<any[]>('/api/admin/ai-model-configs'));
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
      if (this.editingId) {
        await firstValueFrom(this.http.put(`/api/admin/ai-model-configs/${this.editingId}`, this.form.getRawValue()));
        this.message.set('模型配置已更新。');
        this.editingId = null;
      } else {
        await firstValueFrom(this.http.post('/api/admin/ai-model-configs', this.form.getRawValue()));
        this.message.set('模型配置保存成功。');
      }
      this.form.reset({
        name: '', provider: '', modelName: '', baseUrl: '', apiKey: '', scenario: 'general', temperature: 0.2, maxTokens: 1024, priority: 0, isActive: true
      });
      await this.loadConfigs();
      this.closeModal();
    } catch {
      this.message.set('保存模型配置失败。');
    }
  }

  openModal() {
    this.editingId = null;
    this.form.reset({
      name: '', provider: '', modelName: '', baseUrl: '', apiKey: '', scenario: 'general', temperature: 0.2, maxTokens: 1024, priority: 0, isActive: true
    });
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  editConfig(item: any) {
    this.editingId = item.id;
    this.form.setValue({
      name: item.name,
      provider: item.provider,
      modelName: item.modelName,
      baseUrl: item.baseUrl,
      apiKey: '',
      scenario: item.scenario,
      temperature: item.temperature,
      maxTokens: item.maxTokens,
      priority: item.priority,
      isActive: item.isActive
    });
    this.showModal = true;
  }

  async toggleActive(item: any) {
    try {
      await firstValueFrom(this.http.put(`/api/admin/ai-model-configs/${item.id}`, {
        ...item,
        isActive: !item.isActive
      }));
      await this.loadConfigs();
    } catch {
      this.message.set('切换状态失败。');
    }
  }
}
