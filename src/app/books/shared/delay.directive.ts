import {
  Directive,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core';

@Directive({
  selector: '[bmDelay]'
})
export class DelayDirective implements OnChanges {
  @Input() bmDelay: number | undefined;
  @HostBinding('style.visibility') visibility = 'hidden';

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    const { bmDelay } = changes;
    const delay = bmDelay.currentValue;
    setTimeout(() => {
      this.visibility = 'visible';
    }, delay);
  }
}
