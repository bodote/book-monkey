import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotificationAlertComponent } from './notification-alert.component';
import { HttpErrorResponse } from '@angular/common/http';
import { By } from '@angular/platform-browser';

describe('NotificationAlertComponent', () => {
  let component: NotificationAlertComponent;
  let fixture: ComponentFixture<NotificationAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotificationAlertComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show httpError and error message', () => {
    component.error = {
      httpError: new HttpErrorResponse({
        status: 404,
        statusText: 'message1',
        error: '<pre>message3</pre>'
      }),
      errorMessage: 'message2'
    };
    fixture.detectChanges();
    const httpErrorMessage = fixture.debugElement.query(
      By.css('[data-id="httpError"]')
    );
    const errorMessage = fixture.debugElement.query(
      By.css('[data-id="errorMessage"]')
    );
    const alertText = fixture.debugElement.query(
      By.css('[data-id="errorAlert"]')
    );
    expect(httpErrorMessage.nativeElement.textContent).toContain('message1');
    expect(errorMessage.nativeElement.textContent).toContain('message2');
    expect(alertText.nativeElement.textContent).toContain('Status: 404');
    expect(alertText.nativeElement.textContent).toContain('message3');
  });
  it('should show  error message', () => {
    component.error = {
      httpError: null,
      errorMessage: 'message2'
    };
    fixture.detectChanges();
    const httpErrorMessage = fixture.debugElement.query(
      By.css('[data-id="httpError"]')
    );
    const errorMessage = fixture.debugElement.query(
      By.css('[data-id="errorMessage"]')
    );
    //TODO: needed ?
    const alertText = fixture.debugElement.query(
      By.css('[data-id="errorAlert"]')
    );
    expect(httpErrorMessage).toBeFalsy();
    expect(errorMessage.nativeElement.textContent).toContain('message2');
  });
  it('should close messsage when click() on close svg', () => {
    const closeEvtEmtr = spyOn(component.closeErrorEventEmitter, 'emit');
    const close = spyOn(component, 'close').and.callThrough();
    component.error = {
      httpError: new HttpErrorResponse({ status: 404, statusText: 'message1' }),
      errorMessage: 'message2'
    };
    fixture.detectChanges();
    const svg = fixture.debugElement.query(
      By.css('[data-id="closeBtn"]')
    ).nativeElement;
    svg.dispatchEvent(new Event('click'));
    fixture.detectChanges();
    expect(close).toHaveBeenCalledTimes(1);
    expect(closeEvtEmtr).toHaveBeenCalledTimes(1);
  });
});
