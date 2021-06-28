import { NgModule } from "@angular/core";
import { ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

import { PostCreateComponent } from "./post-create/post-create.component";
import { PostListComponent } from "./post-list/post-list.component";
import { PostViewComponent } from "./post-view/post-view.component";
import { CommentComponent } from "./comments/comment.component";
import { AngularMaterialModule } from "../angular-material.module";
import { FormsModule } from '@angular/forms';
import { CKEditorModule } from 'ng2-ckeditor';

@NgModule({
  declarations: [PostCreateComponent, PostListComponent, PostViewComponent, CommentComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule,
    FormsModule,
    CKEditorModule
  ]
})
export class PostsModule {}
