import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookListComponent } from './book-list/book-list.component';
import { BookDetailsComponent } from './book-details/book-details.component';
import { ListLoadedGuard } from './book-list/list-loaded.guard';
import { BookDetailsGuard2 } from './book-details/book-details2.guard';
import { BookEditComponent } from '../admin/book-edit/book-edit.component';
import { CreateBookComponent } from '../admin/create-book/create-book.component';

const routes: Routes = [
  {
    path: 'list',
    component: BookListComponent,
    canActivate: [ListLoadedGuard]
  },
  {
    path: 'detail/:isbn',
    component: BookDetailsComponent,
    canActivate: [BookDetailsGuard2]
  },
  {
    path: 'detail/:isbn',
    redirectTo: '/error'
  },
  {
    path: 'edit/:isbn',
    component: BookEditComponent,
    canActivate: [BookDetailsGuard2]
  },
  { path: 'create', component: CreateBookComponent },
  { path: '', redirectTo: 'admin/create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BooksRoutingModule {}
