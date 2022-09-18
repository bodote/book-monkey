import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookEditComponent } from './book-edit/book-edit.component';
import { CreateBookComponent } from './create-book/create-book.component';
import { BookDetailsGuard } from '../books/book-details/book-details.guard';

const routes: Routes = [
  {
    path: 'edit/:isbn',
    component: BookEditComponent,
    canActivate: [BookDetailsGuard]
  },
  { path: 'create', component: CreateBookComponent },
  { path: '', redirectTo: 'admin/create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
