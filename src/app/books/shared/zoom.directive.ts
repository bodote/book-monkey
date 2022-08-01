import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[bmZoom]'
})
export class ZoomDirective {
  @HostBinding('class.small') smallActive = false;
  @HostBinding('class.tiny') tinyActive = true;
  @HostListener('mouseenter')
  smallOn() {
    this.smallActive = true;
    this.tinyActive = false;
  }
  @HostListener('mouseleave')
  smallOff() {
    this.smallActive = false;
    this.tinyActive = true;
  }
  constructor() {}
}
