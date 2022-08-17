import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: '[bmZoom]'
})
export class ZoomDirective {
  // make class="px-10 pt-10 pb-10 if mouse is NOT over , i.e. image is smaller because of padding 10,
  // otherwise,
  // if mouse is over, then no classes, so image appears bigger, no padding
  smallActive: boolean = true;

  @HostBinding('class')
  get elementClasses() {
    return {
      'px-10': this.smallActive,
      'pt-10': this.smallActive,
      'pb-10': this.smallActive
    };
  }

  @HostListener('mouseenter')
  smallOn() {
    this.smallActive = false;
  }
  @HostListener('mouseleave')
  smallOff() {
    this.smallActive = true;
  }
  constructor() {}
}
