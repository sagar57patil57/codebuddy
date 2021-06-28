import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({ providedIn: "root" })
export class UsersService {

    constructor(private http: HttpClient) {}

    getUserById (id: string) {
        return this.http.get<any>(BACKEND_URL + '/' + id);
    }

}