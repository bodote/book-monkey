import { Directive, HostBinding, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[bmDelay]'
})
export class DelayDirective implements OnInit {
  @Input() bmDelay: number | undefined;
  @HostBinding('style.visibility') visibility = 'hidden';

  constructor() {}

  ngOnInit(): void {
    if (this.bmDelay) {
      setTimeout(() => {
        this.visibility = 'visible';
      }, this.bmDelay);
    }
  }
}
