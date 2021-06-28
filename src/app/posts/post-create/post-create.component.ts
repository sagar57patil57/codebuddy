import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";

import { PostsService } from "../posts.service";
import { Post } from "../post.model";
import { mimeType } from "./mime-type.validator";
import { AuthService } from "../../auth/auth.service";
import { ToasterService } from '../../services/toast.service';

@Component({
  selector: "app-post-create",
  templateUrl: "./post-create.component.html",
  styleUrls: ["./post-create.component.css"]
})
export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  post: Post;
  isLoading = false;
  form: FormGroup;
  // imagePreview: string;
  private mode = "create";
  private postId: string;
  private authStatusSub: Subscription;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService,
    private toasterService: ToasterService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      title: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      content: new FormControl(null, { validators: [Validators.required] }),
      // image: new FormControl(null, {
      //   validators: [Validators.required],
      //   asyncValidators: [mimeType]
      // })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.mode = "edit";
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
            // imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({
            title: this.post.title,
            content: this.post.content,
            // image: this.post.imagePath
          });
          this.enteredContent = this.post.content;
        });
      } else {
        this.mode = "create";
        this.postId = null;
      }
    });
  }

  // onImagePicked(event: Event) {
  //   const file = (event.target as HTMLInputElement).files[0];
  //   this.form.patchValue({ image: file });
  //   this.form.get("image").updateValueAndValidity();
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     this.imagePreview = reader.result as string;  //  reader.result is path of image in local fs
  //   };
    /*
      The readAsDataURL method is used to read the contents of the specified Blob or File. 
      When the read operation is finished, the readyState becomes DONE, and the loadend is triggered.'
      At that time, the result attribute contains  the data as a URL representing the file's data
      as a base64 encoded string
    */
  //   reader.readAsDataURL(file);
  // }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.form.patchValue({
        content: this.enteredContent
      });
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        // this.form.value.image
      );
      this.toasterService.showSuccess('Thank you! Your editorial will be reviewed by our team shortly...', '');
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        // this.form.value.image
      );
    }
    this.form.reset();
  }

  onChange (ev) {
    this.form.patchValue({
      content: this.enteredContent
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
