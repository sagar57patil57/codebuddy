import { Component, OnInit } from '@angular/core';
import { TodosService } from '../services/todo.service';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css']
})
export class TodoComponent implements OnInit {

  todos = [];
  constructor(
    private _todosService: TodosService
  ) { }

  ngOnInit() {
    this._todosService.getToDo().subscribe(response => {
      console.log(response);
      this.todos = response.data;
    });
  }

  openLink (problemLink) {
    window.open(problemLink)
  }

  deleteTodo (id: string) {
    this._todosService.deleteToDo(id).subscribe(response => {
      console.log(response);
      this.todos = this.todos.filter(todo => todo._id !== id);
    });
  }

}
