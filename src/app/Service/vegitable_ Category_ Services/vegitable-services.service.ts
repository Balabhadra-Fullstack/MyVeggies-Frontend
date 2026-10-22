import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Vegcategory } from 'src/app/Model/Vegcategory';

@Injectable({
  providedIn: 'root'
})
export class VegitableServicesService {
  public baseurl: string = 'http://localhost:8090/';

  constructor(private http: HttpClient) { }

public getvegetableByCartegory(id:number):Observable<any[]>{
  return this.http.get<any[]>(this.baseurl + 'api/vegetables/getByid/' + id);
}
public getallVegetablecategory():Observable<Vegcategory[]>{
  return this.http.get<Vegcategory[]>('http://localhost:8090/api/vegcategories/getall');
}


}
