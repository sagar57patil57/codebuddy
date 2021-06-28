import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";


const TODO_BACKEND_URL = environment.apiUrl + "/todo";

@Injectable({ providedIn: "root" })
export class TodosService {

    constructor(private http: HttpClient) {}

    addToDo (payload) {
        return this.http.post<any>(TODO_BACKEND_URL + "/add", payload);
    }

    deleteToDo (todoId: string) {
        return this.http.delete<any>(TODO_BACKEND_URL + "/" + todoId);
    }

    getToDo () {
        return this.http.get<any>(TODO_BACKEND_URL + "/list");
    }

}
