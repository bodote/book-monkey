import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import { SuccessAlertComponent } from './success-alert.component';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { AppState } from '../../store';
import { mockState } from '../../store/index.spec';
import { By } from '@angular/platform-browser';
import { resetSavedSuccessFlag } from '../../books/store/book-entity/book-entity.actions';

describe('SuccessAlertComponent', () => {
  let component: SuccessAlertComponent;
  let fixture: ComponentFixture<SuccessAlertComponent>;
  let store: MockStore;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SuccessAlertComponent],
      providers: [provideMockStore<AppState>({ initialState: mockState() })]
    }).compileComponents();

    fixture = TestBed.createComponent(SuccessAlertComponent);
    component = fixture.componentInstance;
    component.successMsg = 'book saved';

    store = TestBed.inject(MockStore);
  });

  it('should create', () => {
    //component.saved = false;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  it('should fire a resetSavedSuccessFlag action after 5 sec', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.saved = true;
    fixture.detectChanges();
    const message = fixture.debugElement.query(By.css('[data-id="message"]'));
    expect(message.nativeElement.textContent).toContain('Book saved!');
    tick(4000);
    expect(dispatchSpy).toHaveBeenCalledTimes(0);
    tick(1000);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const action = resetSavedSuccessFlag();
    expect(dispatchSpy).toHaveBeenCalledWith(action);
    expect(action.type).toEqual('[BookEntity/API] Reset Saved Success Flag');
  }));
  it('should fire a resetSavedSuccessFlag action after 5 sec', fakeAsync(() => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.saved = false;
    fixture.detectChanges();
    let message = fixture.debugElement.query(By.css('[data-id="message"]'));
    expect(message).toBeFalsy();
    tick(1000);
    component.saved = true;
    fixture.detectChanges();
    message = fixture.debugElement.query(By.css('[data-id="message"]'));
    expect(message.nativeElement.textContent).toContain('Book saved!');
    tick(4000);
    expect(dispatchSpy).toHaveBeenCalledTimes(0);
    tick(1000);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const action = resetSavedSuccessFlag();
    expect(dispatchSpy).toHaveBeenCalledWith(action);
    expect(action.type).toEqual('[BookEntity/API] Reset Saved Success Flag');
  }));
});
