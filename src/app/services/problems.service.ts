import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";


const BACKEND_URL = environment.apiUrl + "/problems";
const RANDOM_Q_BACKEND_URL = environment.apiUrl + "/random";

@Injectable({ providedIn: "root" })
export class ProblemsService {

    constructor(private http: HttpClient) {}

    getProblems (params: string) {
        console.log(BACKEND_URL + '?tags=' + params)
        return this.http.get<any>(BACKEND_URL + '?tags=' + params);
    }

    getRandomProblem (params: string) {
        return this.http.get<any>(RANDOM_Q_BACKEND_URL + '?type=' + params);
    }

}