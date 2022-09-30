import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { resetSavedSuccessFlag } from '../../books/store/book-entity/book-entity.actions';

interface OnInit {}

@Component({
  selector: 'bm-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.css']
})
export class SuccessAlertComponent {
  _saved: boolean = false;
  @Input() successMsg: string = 'Book has been saved successfully';
  @Input() set saved(value: boolean) {
    this._saved = value;
    if (this._saved) {
      setTimeout(() => {
        this.store.dispatch(resetSavedSuccessFlag());
      }, 5000);
    }
  }
  get saved(): boolean {
    return this._saved;
  }
  constructor(private store: Store) {}
}
