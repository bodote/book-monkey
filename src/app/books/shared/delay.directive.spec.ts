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
  template: '<div  [bmDelay]="undefined" >testcontent</div>'
})
class TestUndefComponent {}

@Component({
  template: '<div  [bmDelay]="100" >testcontent</div>'
})
class Test100Component {}
describe('DelayDirective', () => {
  describe('..delay 100ms  ', () => {
    let fixture: ComponentFixture<Test100Component>;
    let component: Test100Component;
    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [Test100Component, DelayDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).createComponent(Test100Component);
      component = fixture.componentInstance;
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
        tick(90);
        fixture.detectChanges();
        expect(style.visibility).toBe('hidden');
        tick(10);
        fixture.detectChanges();
        expect(style.visibility).toBe('visible');
      })
    );
  });
  describe('..delay undefined (same as 0ms!) .. ', () => {
    let fixture: ComponentFixture<TestUndefComponent>;
    let component: TestUndefComponent;
    beforeEach(() => {
      fixture = TestBed.configureTestingModule({
        declarations: [TestUndefComponent, DelayDirective],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }).createComponent(TestUndefComponent);
      component = fixture.componentInstance;
    });

    it(
      'should create an instance of the parent test component ' +
        'with style.visiblity = hidden, after 10ms should change to visible ',
      fakeAsync(() => {
        console.log('1.  detectChanges ');
        fixture.detectChanges();
        let div = fixture.debugElement.query(By.css('div'));
        expect(div).toBeDefined();
        expect(div.nativeElement.textContent).toContain('testcontent');
        let style = div.nativeElement.style;
        expect(style.visibility).toBe('hidden');
        tick(0);
        console.log('2.  detectChanges ');
        fixture.detectChanges();
        expect(style.visibility).toBe('visible');
        tick(99);
        console.log('3.  detectChanges ');
        fixture.detectChanges();
        expect(style.visibility).toBe('visible');
      })
    );
  });
});
