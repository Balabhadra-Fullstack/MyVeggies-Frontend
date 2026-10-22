import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { crateResponse } from 'src/app/Model/crateResponse';
import { CrateReturnRequest } from 'src/app/Model/CrateReturnRequest';
import { CustomerPayment } from 'src/app/Model/CustomerPayment';
import { CustomerPaymentResponse } from 'src/app/Model/CustomerPaymentResponse';
import { ResponseBackend } from 'src/app/Model/ResponseBackend';
import { Sale } from 'src/app/Model/Sale';
import { SaleResponse } from 'src/app/Model/SaleResponse';

@Injectable({
  providedIn: 'root'
})
export class SaleServiceService {

  constructor(private http: HttpClient) { }
public baseurl: string = 'http://localhost:8090/';

public addsale(data:Sale):Observable<Sale[]>{
  return this.http.post<Sale[]>(this.baseurl+'api/sale/add',data);
}
public editSale(data:Sale,id:number):Observable<Sale[]>{
  return this.http.put<Sale[]>(this.baseurl+'api/sale/update/'+id,data);
}
public getLast3Sale(id:number):Observable<SaleResponse[]>{
  return this.http.get<SaleResponse[]>(this.baseurl+'api/sale/last3Sale/'+id);  
}
public getLast3Payment(id:number):Observable<CustomerPaymentResponse[]>{
  return this.http.get<CustomerPaymentResponse[]>(this.baseurl+'api/customer-payments/last3/'+id);  
}
public getCrateDetails(id:number):Observable<crateResponse[]>{
  return this.http.get<crateResponse[]>(this.baseurl+'api/sale/crate-details/'+id);  
}
public returnCrate(data:CrateReturnRequest):Observable<any[]>{
  return this.http.post<any[]>(this.baseurl+'api/crate-return/add',data)
}
public addpayment(data:CustomerPayment):Observable<ResponseBackend>{
  return this.http.post<ResponseBackend>(this.baseurl+'api/customer-payments/add',data)
}
}