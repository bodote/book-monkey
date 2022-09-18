// noinspection JSUnusedGlobalSymbols

import { Injectable } from '@angular/core';
import { Actions } from '@ngrx/effects';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable()
export class RouterEffects {
  constructor(
    private actions$: Actions,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // currently empty
}
