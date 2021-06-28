import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/comment";

@Injectable({ providedIn: "root" })
export class CommentsService {

    constructor(private http: HttpClient) {}

    getCommentById (id: string) {
        return this.http.get<any>(BACKEND_URL + '/' + id);
    }

    addComment(data: any) {
        return this.http.post<any>(BACKEND_URL + '/add', data);
    }

    deleteComment (cId: string, pId: string) {
        return this.http.delete<any>(BACKEND_URL + '/' + pId + '/' + cId);
    }

}