import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectErrorState } from '../books/store/book-entity/book-entity.selectors';
import { resetErrorsAction } from '../books/store/book-entity/book-entity.actions';
import { Router } from '@angular/router';

@Component({
  selector: 'bm-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.css']
})
export class ErrorPageComponent implements OnInit {
  error$ = this.store.select(selectErrorState);
  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    return;
  }

  closeError() {
    this.store.dispatch(resetErrorsAction());
    this.router.navigate(['/home']);
  }
}
