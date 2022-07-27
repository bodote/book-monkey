import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookDetailsComponent } from './book-details/book-details.component';
import { BookListComponent } from './book-list/book-list.component';
import { HomeComponent } from './home/home.component';
import { BookFormComponent } from './book-edit/book-form.component';
import { CreateBookComponent } from './create-book/create-book.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  { path: 'home', component: HomeComponent },
  { path: 'list', component: BookListComponent },
  { path: 'detail/:isbn', component: BookDetailsComponent },
  { path: 'detail/edit/:isbn', component: BookFormComponent },
  { path: 'admin', redirectTo: 'admin/create', pathMatch: 'full' },
  { path: 'admin/create', component: CreateBookComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
