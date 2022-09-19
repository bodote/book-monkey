import { Component, Input } from '@angular/core';

interface OnInit {}

@Component({
  selector: 'bm-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.css']
})
export class SuccessAlertComponent implements OnInit {
  @Input() saved: boolean = false;
  @Input() successMsg: string = 'Book has been saved successfully';
  // @Input() set saved(value: boolean) {
  //   this._saved = value;
  //   console.log('set saved: ' + new Date().toLocaleTimeString());
  //   if (this._saved) {
  //     setTimeout(() => {
  //       console.log('setTimeout reset: ' + new Date().toLocaleTimeString());
  //       this._saved = false;
  //     }, 5000);
  //   }
  // }

  constructor() {
    console.log('constr: ' + new Date().toLocaleTimeString());
  }
  ngOnInit() {
    console.log('ngOnInit: ' + new Date().toLocaleTimeString());
  }
}
