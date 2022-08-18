import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMessagesComponent } from './form-messages.component';
import { FormControl, Validators } from '@angular/forms';

describe('FormMessagesComponent', () => {
  let component: FormMessagesComponent;
  let fixture: ComponentFixture<FormMessagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormMessagesComponent]
    }).compileComponents();
    fixture = TestBed.createComponent(FormMessagesComponent);
    component = fixture.componentInstance;
  });

  it('should create an array of errormessage that fit to a "title" control ', () => {
    expect(component).toBeTruthy();
    component.control = new FormControl(null, Validators.required);
    component.controlName = 'title';
    fixture.detectChanges();
    expect(component.errorsForControl()).toEqual(['A Title is required']);
  });
  it('should create an array of errormessage that fit to a "title" control ', () => {
    expect(component).toBeTruthy();
    component.control = new FormControl('123', [
      Validators.required,
      Validators.minLength(11)
    ]);
    component.controlName = 'isbn';
    fixture.detectChanges();
    expect(component.errorsForControl()).toEqual(['at least 11 chars']);
  });
  it('should create no errormessage  ', () => {
    expect(component).toBeTruthy();
    component.control = new FormControl('123', [
      Validators.required,
      Validators.minLength(3)
    ]);
    component.controlName = 'isbn';
    fixture.detectChanges();
    expect(component.errorsForControl()).toEqual([]);
  });
});
