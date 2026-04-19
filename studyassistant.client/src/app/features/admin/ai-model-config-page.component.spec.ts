import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { AiModelConfigPageComponent } from './ai-model-config-page.component';

describe('AiModelConfigPageComponent', () => {
  let fixture: ComponentFixture<AiModelConfigPageComponent>;
  let component: AiModelConfigPageComponent;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AiModelConfigPageComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()]
    }).compileComponents();

    fixture = TestBed.createComponent(AiModelConfigPageComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    httpMock.expectOne('/api/admin/ai-model-configs').flush([]);
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('opens modal when clicking add button', () => {
    const buttons = Array.from(
      fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>
    );
    const addButton = buttons.find((button) => button.textContent?.includes('新增配置'));

    expect(addButton).toBeTruthy();

    addButton!.click();
    fixture.detectChanges();

    expect(component.showModal).toBe(true);
    expect(fixture.nativeElement.querySelector('.modal-mask')).toBeTruthy();
  });

  it('submits a new config and closes modal', async () => {
    component.openModal();
    fixture.detectChanges();

    component.form.setValue({
      name: 'Primary GPT',
      provider: 'OpenAI',
      modelName: 'gpt-4.1',
      baseUrl: 'https://api.example.com',
      apiKey: 'secret-key',
      scenario: 'general',
      temperature: 0.2,
      maxTokens: 1024,
      priority: 0,
      isActive: true
    });

    const savePromise = component.createConfig();

    const createRequest = httpMock.expectOne('/api/admin/ai-model-configs');
    expect(createRequest.request.method).toBe('POST');
    createRequest.flush({ id: 1 });

    await Promise.resolve();

    const reloadRequest = httpMock.expectOne('/api/admin/ai-model-configs');
    expect(reloadRequest.request.method).toBe('GET');
    reloadRequest.flush([]);

    await savePromise;
    fixture.detectChanges();

    expect(component.showModal).toBe(false);
    expect(component.form.getRawValue().name).toBe('');
    expect(component.form.getRawValue().modelName).toBe('');
  });
});
