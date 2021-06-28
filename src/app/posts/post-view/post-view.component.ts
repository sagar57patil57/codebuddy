import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Post } from "../post.model";
import { PostsService } from "../posts.service";
import { AuthService } from "../../auth/auth.service";
import { UsersService } from "../../services/users.service";
import { CommentsService } from "../../services/comments.service";
import { ToasterService } from '../../services/toast.service';

@Component({
  selector: "app-post-view",
  templateUrl: "./post-view.component.html",
  styleUrls: ["./post-view.component.css"]
})
export class PostViewComponent implements OnInit {
  post: Post = null;
  isLoading = false;
  userIsAuthenticated = false;
  userId: string;
  postId: string;
  postCreator: any;
  comments = [];
  content = '';
  action = 'like';
  status = null;
  private postsSub: Subscription;
  private authStatusSub: Subscription;
  showUpdate: boolean = false;

  constructor(
    public postsService: PostsService,
    private authService: AuthService,
    public route: ActivatedRoute,
    private userService: UsersService,
    private commentsService: CommentsService,
    private toasterService: ToasterService
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("postId")) {
        this.postId = paramMap.get("postId");
        this.isLoading = true;
        this.postsService.getPost(this.postId).subscribe((postData: any) => {
          this.isLoading = false;
          this.showUpdate = postData.showUpdate;
          this.post = postData.data;
          this.status = this.post.status;
          console.log("fetched", this.post.status);
          this.userService.getUserById(postData.data.creator).subscribe(userData => {
            if (userData) {
              this.postCreator = userData;
            }
          });
          this.fetchComments();
        });
      }
    })
  }

  fetchComments () {
    this.commentsService.getCommentById(this.postId).subscribe(commentData => {
      if (commentData) {
        this.comments = commentData.data;
      }
      console.log(commentData)
    });
  }

  getFormattedDate (date: string) {
    return new Date(date).toLocaleDateString("en-US");
  }

  addComment() {
    console.log(this.content)
    const userComment = {
      content: this.content,
      postId: this.postId
    }
    this.commentsService.addComment(userComment).subscribe(data => {
      console.log(data)
    });
    this.fetchComments();
    this.content = '';
  }

  deleteComment(commentId: string) {
    console.log(commentId)
    this.comments = this.comments.filter((comment) => comment._id !== commentId);
    this.commentsService.deleteComment(commentId, this.postId).subscribe(data => {
      console.log(data)
    });
  }

  like () {
    const payload = {
      action: this.action,
      postId: this.postId
    }
    this.postsService.likeAPost(payload).subscribe((response: any) => {
      console.log(response.data)
      this.togglelike(response.data);
    });
  }

  togglelike (counter: any) {
      this.post.likeCount ? this.post.likeCount = this.post.likeCount+counter : this.post.likeCount = counter;
      this.action === 'like' ? this.action = 'dislike' : this.action = 'like';
  }

  setDropDownValue (ev) {
    this.status = ev.target.value;
  }

  updateStatus () {
    if (this.post.status !== this.status) {
      const payload = {
        id: this.postId,
        status: this.status
      }
      //  call api to update status
      this.postsService.updateStatus(payload).subscribe((response: any) => {
        this.post.status = this.status;
        if (response.success) {
          this.toasterService.showSuccess(response.message, '');
        }
        console.log(response);
      })
    }
  }

  getStatusColor () {
    if (!this.post || !this.post.status) {
      return
    }
    if (this.post.status === 'pending') {
      return 'orange';
    } else if (this.post.status === 'approved') {
      return 'green';
    } else if (this.post.status === 'rejected') {
      return 'red';
    }
  }

  getCleanHtml (text) {
    if (!text) {
      return
    }
    return text.replace(/\n|\r/g, "")
  }

}
