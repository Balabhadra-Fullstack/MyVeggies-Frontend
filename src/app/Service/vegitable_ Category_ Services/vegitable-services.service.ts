import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vegcategory } from 'src/app/Model/Vegcategory';
import { Vegetable } from 'src/app/Model/Vegetable';

@Injectable({
  providedIn: 'root'
})
export class VegitableServicesService {
  public baseurl: string = 'http://localhost:8090/';

  constructor(private http: HttpClient) { }

public getvegetableByCartegory(id:number):Observable<Vegetable[]>{
  return this.http.get<Vegetable[]>(this.baseurl + 'api/vegetables/getByid/' + id);
}
public getallVegetablecategory():Observable<Vegcategory[]>{
  return this.http.get<Vegcategory[]>('http://localhost:8090/api/vegcategories/getall');
}


}
