import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard, authGuard } from './features/auth/auth.guards';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent)
  },
  {
    path: 'camera',
    loadComponent: () => import('./features/camera/camera-page').then(m => m.CameraPage)
  },
  {
    path: 'report/:taskId',
    loadComponent: () => import('./features/report/report-page').then(m => m.ReportPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login-page.component').then((m) => m.LoginPageComponent)
  },
  {
    path: 'admin/users',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/user-management-page.component').then((m) => m.UserManagementPageComponent)
  },
  {
    path: 'admin/ai-models',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/ai-model-config-page.component').then((m) => m.AiModelConfigPageComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./features/home/home-page.component').then((m) => m.HomePageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
