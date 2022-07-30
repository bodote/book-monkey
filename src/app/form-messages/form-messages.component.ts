import { Component, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'bm-form-messages',
  templateUrl: './form-messages.component.html',
  styleUrls: ['./form-messages.component.css']
})
export class FormMessagesComponent {
  @Input() control: AbstractControl | null = null;
  @Input() controlName: string = '';
  requiredText: string = 'An Error';
  minLengthText: string = '';
  maxLengthText: string = '';

  errorstruct = {
    title: {
      required: 'A Title is required'
    },
    isbn: {
      required: 'ISBN Number is required',
      maxlength: 'not longer then 13 chars',
      minlength: 'at least 11 chars',
      isbnLength: 'ISBN not valid, must be 10 or 13 digits',
      isbnExists: 'ISBN already exists'
    }
  };

  constructor() {}

  stringify(s: any): string {
    return JSON.stringify(s);
  }
  errorsForControl(): string[] {
    if (this.control?.errors) {
      let valErrors: ValidationErrors = this.control
        ?.errors as ValidationErrors;
      const errorMsgs =
        this.errorstruct[this.controlName as keyof typeof this.errorstruct];
      return Object.keys(valErrors).map(
        (key) => errorMsgs[key as keyof typeof errorMsgs]
      );
    }
    return [];
  }
}
