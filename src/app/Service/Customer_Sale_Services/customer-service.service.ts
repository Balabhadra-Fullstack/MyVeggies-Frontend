import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerResponse } from 'src/app/Model/CustomerResponse';
import { SearchCustomer } from 'src/app/Model/SearchCustomer';
import { Customer } from 'src/app/Model/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerServiceService {

  public baseurl: string = 'http://localhost:8090/';

  constructor(private http: HttpClient) { }
  public add(data:Customer):Observable<Customer[]>{
    return this.http.post<Customer[]>(this.baseurl+'api/customers/add',data);
  }
  public getByid(id:number):Observable<CustomerResponse[]>{
    return this.http.get<CustomerResponse[]>(this.baseurl+'api/customers/'+id);
  }

  public searchCustomer(name: string): Observable<SearchCustomer[]> {
    return this.http.get<SearchCustomer[]>(this.baseurl + 'api/customers/search?name=' + name);
  }
  public search(name:string):Observable<CustomerResponse[]>{
    return this.http.get<CustomerResponse[]>(this.baseurl + 'api/customers/searchCustomer?name=' +name);
  }
}
