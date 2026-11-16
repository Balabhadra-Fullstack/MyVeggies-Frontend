import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { crateResponse } from 'src/app/Model/crateResponse';
import { CrateReturnRequest } from 'src/app/Model/CrateReturnRequest';
import { CustomerPayment } from 'src/app/Model/CustomerPayment';
import { CustomerPaymentResponse } from 'src/app/Model/CustomerPaymentResponse';
import { PageResponse } from 'src/app/Model/PageResponse';
import { ResponseBackend } from 'src/app/Model/ResponseBackend';
import { Sale } from 'src/app/Model/Sale';
import { SaleResponse } from 'src/app/Model/SaleResponse';
import { SaleResponseWithCrate } from 'src/app/Model/SaleResponseWithCrate';

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
public getSaleByid(id:number):Observable<Sale>{
  return this.http.get<Sale>(this.baseurl+'api/sale/get/'+id);
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
  return this.http.post<any[]>(this.baseurl+'api/crate-return/add',data);
}
public addpayment(data:CustomerPayment):Observable<ResponseBackend>{
  return this.http.post<ResponseBackend>(this.baseurl+'api/customer-payments/add',data);
}
public getLast30sale(customerId:number):Observable<SaleResponseWithCrate[]>{
  return this.http.get<SaleResponseWithCrate[]>(this.baseurl+'api/sale/last30/'+customerId);
}
getSalesBetweenDates(
  id: number,
  startDate: string,
  endDate: string,
  page: number,
  size: number
): Observable<PageResponse<SaleResponse>> {

  const params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('page', page.toString())
    .set('size', size.toString());

  return this.http.get<PageResponse<SaleResponse>>(
    this.baseurl + 'api/sale/getsaleBetweenDate/' + id + '/date-range',
    { params }
  );
}
public getSaleByIdWithCrate(id:number):Observable<any>{
  return this.http.get<any>(this.baseurl+'api/sale/getsalewithcrate/'+id);

}
public getpaymentById(id:number,startDate:string,endDate:string,page:number,size:number):Observable<CustomerPaymentResponse>{
  const params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate)
    .set('page', page.toString())
    .set('size', size.toString());

  return this.http.get<CustomerPaymentResponse>(
    this.baseurl + 'api/customer-payments/by-customer/' + id,
    { params }
  );
}
public getpaymentByIdForEdit(id:number):Observable<CustomerPaymentResponse>{
  return this.http.get<CustomerPaymentResponse>(this.baseurl+'api/customer-payments/getbypaymentid/'+id);
}
public editPayment(paymentId:number,data:CustomerPayment):Observable<ResponseBackend>{
  return this.http.put<ResponseBackend>(this.baseurl+'api/customer-payments/update/'+paymentId,data);
}
}