import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-camera-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera-page.html',
  styleUrls: ['./camera-page.css']
})
export class CameraPage {
  selectedFile: File | null = null;
  uploading = false;
  uploadSuccess = false;
  uploadError = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0] as File;
    }
  }

  upload() {
    if (!this.selectedFile) return;
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    this.uploading = true;
    this.uploadSuccess = false;
    this.uploadError = '';
    this.http.post<any>('/api/homework-analyses/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: event => {
        if (event.type === HttpEventType.Response) {
          this.uploading = false;
          if (event.body && event.body.taskId) {
            this.uploadSuccess = true;
            this.router.navigate(['/report', event.body.taskId]);
          } else {
            this.uploadError = '上传成功但未返回任务ID';
          }
        }
      },
      error: err => {
        this.uploading = false;
        this.uploadError = err?.error?.message || '上传失败';
      }
    });
  }
}
