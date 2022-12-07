import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorComponent } from './calculator.component';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CalculatorComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should calc summe', () => {
    fixture.detectChanges();
    let zahl1 = component.myForm?.get('zahl1');
    expect(zahl1?.value).toEqual('');
    const zahl1html = fixture.debugElement.query(By.css('[id="zahl1"]'));
    let placeholder = zahl1html.nativeElement.getAttribute('placeholder');
    expect(placeholder).toContain('42');
    const zahl2html = fixture.debugElement.query(By.css('[id="zahl2"]'));
    let placeholder2 = zahl1html.nativeElement.getAttribute('placeholder');
    let zahl2 = component.myForm?.get('zahl2');
    expect(zahl1?.value).toEqual('');
    zahl1?.setValue('2');
    expect(zahl1?.value).toContain('2');
    zahl2?.setValue('2');
    expect(zahl2?.value).toContain('2');
    expect(placeholder2).toContain('42');
    const buttonEl = fixture.debugElement.query(By.css('button'));
    buttonEl.nativeElement.click();
    fixture.detectChanges();
    let result = fixture.debugElement.query(By.css('[data-id="product"]'));
    expect(result.nativeElement.innerText).toContain('4');
  });
});
