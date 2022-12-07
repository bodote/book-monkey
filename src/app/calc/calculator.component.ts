import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'bm-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent implements OnInit {
  myForm: FormGroup | undefined;
  summe: number | undefined;
  produkt: number | undefined;

  constructor() {}

  ngOnInit(): void {
    this.myForm = new FormGroup({
      zahl1: new FormControl(''),
      zahl2: new FormControl('')
    });
  }

  submitForm() {
    let zahl1 = Number(this.myForm?.get('zahl1')?.value);
    let zahl2 = Number(this.myForm?.get('zahl2')?.value);
    this.summe = zahl2 * zahl1;
    this.produkt = zahl2 * zahl1;
  }
}
