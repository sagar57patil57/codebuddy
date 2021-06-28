import { Component, OnInit } from '@angular/core';
import { ProblemsService } from "../services/problems.service";
import { ToasterService } from '../services/toast.service';
import { TodosService } from '../services/todo.service';

@Component({
  selector: 'app-problems',
  templateUrl: './problems.component.html',
  styleUrls: ['./problems.component.css']
})
export class ProblemsComponent implements OnInit {

  problems = [];
  categories = [];
  query = '';
  isLoading = false;
  showFilter = false;
  sortType = '';
  randomQuestion = null;
  randomQuestionLoader: boolean = false;
  questionType: string = 'easy';
  randomLink: string = '';
  constructor(
    private _problemsService: ProblemsService,
    private _todosService: TodosService,
    private toasterService: ToasterService
  ) {
    this.categories = [
      { title: "Implementation", value: "implementation" },
      { title: "greedy", value: "greedy" },
      { title: "String", value: "strings" },
      { title: "Dynamic programming", value: "dp" },
      { title: "Trees", value: "trees" },
      { title: "Sortings", value: "sortings" },
      { title: "Math", value: "math" },
      { title: "Bitmasks", value: "bitmasks" },
      { title: "Geometry", value: "geometry" },
    ]
  }

  ngOnInit() {
    this.getProblems();
  }

  getProblems() {
    this.isLoading = true;
    this._problemsService.getProblems(this.query).subscribe(data => {
      this.problems = (data ? data.data : []);
      this.isLoading = false;
    })
  }

  getContestLink (cId, index) {
    window.open("https://codeforces.com/contest/" + cId + "/problem/" + index, "_blank");
  }

  openNewWindow(link) {
    if (!link) {
      return;
    }
    window.open(link, "_blank")
  }

  setDropDownValue (ev) {
    if (ev.target.value !== this.query) {
      this.query = ev.target.value;
      this.getProblems();
    }
    this.sortType = '';
  }

  sort () {
    if (!this.sortType) {
      this.sortType = 'asc';
    }
    if (this.sortType == 'asc') {
      this.problems = this.problems.sort(function (a, b) {
        if (a.index > b.index) return 1;
        if (a.index < b.index) return -1;
        return 0;
      });
      this.sortType = 'dsc';
    } else if (this.sortType == 'dsc') {
      this.problems = this.problems.sort(function (a, b) {
        if (a.index < b.index) return 1;
        if (a.index > b.index) return -1;
        return 0;
      });
      this.sortType = 'asc';
    }
  }

  addTodo (cId, index, problemName) {
    const problemLink = "https://codeforces.com/contest/" + cId + "/problem/" + index;
    const payload = {
      problemLink,
      problemName
    }
    this._todosService.addToDo(payload).subscribe(response => {
      if (response.success) {
        this.toasterService.showSuccess(response.message, '');
      }
    });
  }

  generateRandomQuestion () {
    this.randomQuestionLoader = true;
    this._problemsService.getRandomProblem(this.questionType).subscribe(response => {
      console.log(response.data);
      this.randomQuestion = response.data;
      this.randomQuestionLoader = false;
      this.randomLink = "https://codeforces.com/contest/" + this.randomQuestion.contestId + "/problem/" + this.randomQuestion.index
      console.log("https://codeforces.com/contest/" + this.randomQuestion.contestId + "/problem/" + this.randomQuestion.index)
    })
  }

  getRandomProblemLink () {
    window.open(this.randomLink, "_blank");
  }

  questionTypeSelected (val) {
    this.questionType = val;
    this.randomQuestion = null;
  }

}
//@TODO: virtual contest with timer