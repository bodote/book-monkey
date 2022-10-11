import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState, loaderFeatureKey } from './store';
import { mockState } from './store/index.spec';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let store: MockStore;
  let fixture: ComponentFixture<AppComponent>;
  beforeEach(async () => {
    JSON.stringify(store);
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent],
      providers: [
        provideMockStore<AppState>({
          initialState: mockState()
        })
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    store = TestBed.inject(MockStore);
  });

  it('should create the app without loading spinner', () => {
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    const svgSpinner = fixture.debugElement.query(
      By.css('[data-id="loadingSpinner"]')
    );
    expect(svgSpinner).toBeFalsy();
  });
  it('should show loading spinner', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
    store.setState(
      mockState({
        [loaderFeatureKey]: { loading: true }
      })
    );
    fixture.detectChanges();
    const svgSpinner = fixture.debugElement.query(
      By.css('[data-id="loadingSpinner"]')
    );
    expect(svgSpinner).toBeTruthy();
  });
});
