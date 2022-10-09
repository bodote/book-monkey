import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectPageLoading } from './store/router.selectors';

@Component({
  selector: 'bm-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading$ = this.store$.select(selectPageLoading);
  constructor(private store$: Store) {}
  dummy(): number {
    // workaround for stryker bug https://github.com/stryker-mutator/stryker-js/issues/3780
    return 0;
  }
}
