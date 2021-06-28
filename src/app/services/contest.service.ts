import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/util";

@Injectable({ providedIn: "root" })
export class ContestService {

    constructor(private http: HttpClient) {}

    getContests () {
        return this.http.get<any>(BACKEND_URL + '/contest/all');
    }

    setReminder (payload) {
        return this.http.post<any>(BACKEND_URL + '/calendar', payload);
    }

}