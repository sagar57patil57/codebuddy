import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PostListComponent } from "./posts/post-list/post-list.component";
import { PostCreateComponent } from "./posts/post-create/post-create.component";
import { PostViewComponent } from "./posts/post-view/post-view.component";
import { AuthGuard } from "./auth/auth.guard";
import { ProblemsComponent } from "./problems/problems.component";
import { ContestsComponent } from "./contests/contests.component";
import { TodoComponent } from "./todo/todo.component";

const routes: Routes = [
  { path: "", component: PostListComponent },
  { path: "editorials", component: PostListComponent },
  { path: "create", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "edit/:postId", component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: "view/:postId", component: PostViewComponent, canActivate: [AuthGuard] },
  { path: "auth", loadChildren: "./auth/auth.module#AuthModule"},
  { path: "problems", component: ProblemsComponent, canActivate: [AuthGuard]},
  { path: "contests", component: ContestsComponent, canActivate: [AuthGuard]},
  { path: "todo", component: TodoComponent, canActivate: [AuthGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
