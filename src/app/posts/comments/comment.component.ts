import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "app-comment",
  templateUrl: "./comment.component.html",
  styleUrls: ["./comment.component.css"]
})
export class CommentComponent {
  
    @Input('comment') comment: any;
    @Input('showDelete') showDelete = false;
    @Output() deleteAComment = new EventEmitter();

  constructor(
    ) {}

    delete () {
        this.deleteAComment.emit(this.comment._id);
    }

    getFormattedDate (date: string) {
        return new Date(date).toLocaleDateString("en-US");
      }
}
