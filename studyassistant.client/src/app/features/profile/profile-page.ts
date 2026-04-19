import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface UserProfile {
  displayName: string;
  grade: string;
  subjectPreference: string;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})
export class ProfilePage implements OnInit {
  readonly loading = signal(true);
  readonly loadError = signal('');
  readonly saving = signal(false);
  readonly saveSuccess = signal(false);
  readonly saveError = signal('');
  readonly profile = signal<UserProfile>({ displayName: '', grade: '', subjectPreference: '' });

  grades = ['初一', '初二', '初三'];
  subjects = ['数学', '英语'];

  constructor(private readonly http: HttpClient) {}

  async ngOnInit() {
    this.loading.set(true);
    this.loadError.set('');
    try {
      const data = await this.http.get<UserProfile>('/api/users/me').toPromise();
      this.profile.set(data ?? { displayName: '', grade: '', subjectPreference: '' });
    } catch (err: any) {
      this.loadError.set('资料加载失败，请重试');
    } finally {
      this.loading.set(false);
    }
  }

  async save() {
    this.saving.set(true);
    this.saveSuccess.set(false);
    this.saveError.set('');
    try {
      await this.http.put('/api/users/me', this.profile()).toPromise();
      this.saveSuccess.set(true);
    } catch (err: any) {
      this.saveError.set('保存失败，请重试');
    } finally {
      this.saving.set(false);
    }
  }
}
