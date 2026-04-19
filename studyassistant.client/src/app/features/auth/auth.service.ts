import { Injectable, signal } from '@angular/core';

export interface AuthSession {
  token: string;
  userName: string;
  role: string;
  displayName: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly session = signal<AuthSession | null>(this.readStoredSession());

  isAuthenticated(): boolean {
    return !!this.session()?.token;
  }

  isAdmin(): boolean {
    return this.session()?.role === 'Admin';
  }

  token(): string {
    return this.session()?.token ?? '';
  }

  setSession(session: AuthSession): void {
    this.session.set(session);
    localStorage.setItem('sa_session', JSON.stringify(session));
  }

  logout(): void {
    this.session.set(null);
    localStorage.removeItem('sa_session');
  }

  private readStoredSession(): AuthSession | null {
    const raw = localStorage.getItem('sa_session');
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      localStorage.removeItem('sa_session');
      return null;
    }
  }
}