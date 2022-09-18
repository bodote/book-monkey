import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { ListLoadedGuard } from './shared/list-loaded.guard';

const routes: Routes = [
  {
    path: 'list',
    component: BookListComponent,
    canActivate: [ListLoadedGuard]
  },
  { path: 'detail/:isbn', component: BookDetailsComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule {}
