import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseBackend } from 'src/app/Model/ResponseBackend';
import { SearchSupplier } from 'src/app/Model/SearchSupplier';
import { Supplier } from 'src/app/Model/Supplier';
import { SupplierResponse } from 'src/app/Model/SupplierResponse';

@Injectable({
  providedIn: 'root'
})
export class SupplierServiceService {

  constructor(private http:HttpClient) { }

   public baseurl:string='http://localhost:8090/';
    
   public addSupplier(data:any):Observable<ResponseBackend>{
    return this.http.post<ResponseBackend>(this.baseurl+'api/suppliers/add',data);
   }

   public getSupplierByid(id:number):Observable<SupplierResponse[]>{
    return this.http.get<SupplierResponse[]>(this.baseurl+'api/suppliers/get/'+id);
   }
   public searchSupplier(data:String):Observable<SearchSupplier[]>{
    return this.http.get<SearchSupplier[]>(this.baseurl+'api/suppliers/search?name='+data);
   }
   public search(data:String):Observable<SupplierResponse[]>{
    return this.http.get<SupplierResponse[]>(this.baseurl+'api/suppliers/searchSupplier?name='+data);
   }
}
