import { Component, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { resetSavedSuccessFlag } from '../../books/store/book-entity/book-entity.actions';

@Component({
  selector: 'bm-success-alert',
  templateUrl: './success-alert.component.html',
  styleUrls: ['./success-alert.component.css']
})
export class SuccessAlertComponent {
  _saved!: boolean | null;
  @Input() successMsg!: string;
  @Input() set saved(value: boolean | null) {
    this._saved = value;
    if (this._saved) {
      setTimeout(() => {
        this.store.dispatch(resetSavedSuccessFlag());
      }, 5000);
    }
  }
  get saved(): boolean | null {
    return this._saved;
  }
  constructor(private store: Store) {}
}
