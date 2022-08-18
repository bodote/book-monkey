import { ZoomDirective } from './zoom.directive';
import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

@Component({
  template: '<div  bmZoom >testcontent</div>'
})
class TestComponent {}

describe('ZoomDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [TestComponent, ZoomDirective],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).createComponent(TestComponent);
  });
  it('should create an instance', () => {
    fixture.detectChanges();
    let div = fixture.debugElement.query(By.css('div'));
    expect(div).toBeDefined();
    let myClassList = div.nativeElement.classList;
    expect(myClassList).toContain('px-10');
    expect(myClassList).toContain('pt-10');
    expect(myClassList).toContain('pb-10');
    let event = new Event('mouseenter');
    div.nativeElement.dispatchEvent(event);
    fixture.detectChanges();

    myClassList = div.nativeElement.classList;
    expect(myClassList).not.toContain('px-10');
    expect(myClassList).not.toContain('pt-10');
    expect(myClassList).not.toContain('pb-10');

    event = new Event('mouseleave');
    div.nativeElement.dispatchEvent(event);
    fixture.detectChanges();

    myClassList = div.nativeElement.classList;
    expect(myClassList).toContain('px-10');
    expect(myClassList).toContain('pt-10');
    expect(myClassList).toContain('pb-10');
  });
});
