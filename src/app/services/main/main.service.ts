import { Injectable } from '@angular/core';



//services
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  private readonly URL_API="http://localhost:3000/api/ToLearn";
  constructor(private http:HttpClient) { }

  //main
  main(){
    return this.http.get<any>(this.URL_API+'/main');
  }


}
