import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BookDetailsComponent } from "./book-details/book-details.component";
import { BookListComponent } from "./book-list/book-list.component";

const routes: Routes = [
  { path: "list", component: BookListComponent },
  { path: "detail/:id", component: BookDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
