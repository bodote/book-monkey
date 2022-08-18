import { DelayDirective } from './delay.directive';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: '<div  [bmDelay]="100" >testcontent</div>'
})
class TestComponent {}

describe('DelayDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, DelayDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).createComponent(TestComponent);
  });

  it(
    'should create an instance of the parent test component ' +
      'with style.visiblity = hidden, after 10ms should change to visible ',
    fakeAsync(() => {
      fixture.detectChanges();
      let div = fixture.debugElement.query(By.css('div'));
      expect(div).toBeDefined();
      expect(div.nativeElement.textContent).toContain('testcontent');
      let style = div.nativeElement.style;
      expect(style.visibility).toBe('hidden');
      tick(100);
      fixture.detectChanges();
      expect(style.visibility).toBe('visible');
    })
  );
});
