import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookEditComponent } from './book-edit/book-edit.component';
import { CreateBookComponent } from './create-book/create-book.component';

const routes: Routes = [
  { path: 'edit/:isbn', component: BookEditComponent },
  { path: 'create', component: CreateBookComponent },
  { path: '', redirectTo: 'admin/create', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
