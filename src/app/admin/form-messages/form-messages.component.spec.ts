import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormMessagesComponent } from './form-messages.component';
import {
  AbstractControl,
  FormControl,
  ValidationErrors,
  Validators
} from '@angular/forms';

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
  it('should create an array of errormessage that fit to a "isbn" control ', () => {
    expect(component).toBeTruthy();
    component.control = new FormControl('123', [
      Validators.required,
      Validators.minLength(11)
    ]);
    component.controlName = 'isbn';
    fixture.detectChanges();
    expect(component.errorsForControl()).toEqual(['at least 11 chars']);
  });
  it('should create re required errormessage that fit to a "isbn" control ', () => {
    expect(component).toBeTruthy();
    component.control = new FormControl(null, [Validators.required]);
    component.controlName = 'isbn';
    fixture.detectChanges();
    expect(component.errorsForControl()).toEqual(['ISBN Number is required']);
  });
  it('should create re maxlen errormessage that fit to a "isbn" control ', () => {
    expect(component).toBeTruthy();
    component.control = new FormControl('123', [Validators.maxLength(1)]);
    component.controlName = 'isbn';
    fixture.detectChanges();
    expect(component.errorsForControl()).toEqual(['not longer then 13 chars']);
  });
  it('should create  ISBN already exists errormessage that fit to a "isbn" control ', () => {
    type valFunctionT = (a: AbstractControl<any, any>) => ValidationErrors;
    const valFn: valFunctionT = jasmine
      .createSpy('authValFn', (arg: AbstractControl<any, any>) => {
        return { isbnExists: { valid: false } } as ValidationErrors;
      })
      .and.callThrough();
    component.control = new FormControl('123', [valFn]);
    component.controlName = 'isbn';
    fixture.detectChanges();
    expect(component.errorsForControl()).toEqual(['ISBN already exists']);
  });
  it('should create  ISBN not valid, must be 10 or 13 digits errormessage that fit to a "isbn" control ', () => {
    type valFunctionT = (a: AbstractControl<any, any>) => ValidationErrors;
    const valFn: valFunctionT = jasmine
      .createSpy('authValFn', (arg: AbstractControl<any, any>) => {
        return { isbnLength: { valid: false } } as ValidationErrors;
      })
      .and.callThrough();
    component.control = new FormControl('123', [valFn]);
    component.controlName = 'isbn';
    fixture.detectChanges();
    expect(component.errorsForControl()).toEqual([
      'ISBN not valid, must be 10 or 13 digits'
    ]);
  });
  it('should create an array of errormessage that fit to a "authors" control ', () => {
    type valFunctionT = (a: AbstractControl<any, any>) => ValidationErrors;
    const valFn: valFunctionT = jasmine
      .createSpy('authValFn', (arg: AbstractControl<any, any>) => {
        return { oneAuthor: { valid: false } } as ValidationErrors;
      })
      .and.callThrough();
    component.control = new FormControl('doesnt matter', [
      Validators.required,
      valFn
    ]);
    component.controlName = 'authors';
    fixture.detectChanges();
    const errors = component.errorsForControl();
    expect(valFn).toHaveBeenCalledOnceWith(component.control);
    expect(errors).toEqual(['we need at least one Author']);
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
