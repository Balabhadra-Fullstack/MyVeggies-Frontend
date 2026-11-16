import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageResponse } from 'src/app/Model/PageResponse';
import { Purchase } from 'src/app/Model/Purchase';
import { PurchaseResponse } from 'src/app/Model/PurchaseResponse';
import { ResponseBackend } from 'src/app/Model/ResponseBackend';
import { SupplierPayemnt } from 'src/app/Model/SupplierPayment';
import { SupplierPaymentResponseDTO } from 'src/app/Model/SupplierPaymentResponseDTO';

@Injectable({
  providedIn: 'root'
})
export class PurchaseServicService {
  
  constructor(private http:HttpClient) { }
  public baseurl:String='http://localhost:8090/';
public addPurchase(data:any):Observable<Purchase[]>{
  return this.http.post<Purchase[]>(this.baseurl+'api/purchases/add',data);
}
public editPurchase(id:number,data:Purchase):Observable<Purchase[]>{
  return this.http.put<Purchase[]>(this.baseurl+'api/purchases/update/'+id,data);
}
public getPurchase():Observable<PurchaseResponse[]>{
  return this.http.get<PurchaseResponse[]>(this.baseurl+'api/purchases/getall');
}
public getLast3Purchase(id:number):Observable<PurchaseResponse[]>{
  return this.http.get<PurchaseResponse[]>(this.baseurl+'api/purchases/last3Purchase/'+id);
}
public getLast3Payment(id:number):Observable<SupplierPaymentResponseDTO[]>{
  return this.http.get<SupplierPaymentResponseDTO[]>(this.baseurl+'api/supplier-payments/last3/'+id);
}
public addpayment(data:SupplierPayemnt):Observable<ResponseBackend>{
  return this.http.post<ResponseBackend>(this.baseurl+'api/supplier-payments/add',data)
}
public getRecentPurchasesBySupplier(supplierId: number): Observable<PurchaseResponse[]> {
  return this.http.get<PurchaseResponse[]>(this.baseurl + `api/purchases/last30Purchase/${supplierId}`);
}
public getpurchaseByid(purcahseId:number):Observable<Purchase>{
  return this.http.get<Purchase>(this.baseurl+'api/purchases/get/'+purcahseId)
}
public getPurchasesBetweenDates(supplierId: number, fromDate: string, toDate: string, currentPage: number, pageSize: number):Observable<PageResponse<PurchaseResponse>> {
     const params = new HttpParams()
    .set('startdate', fromDate)
    .set('enddate', toDate)
    .set('pagee', currentPage.toString())
    .set('size', pageSize.toString());
return this.http.get<PageResponse<PurchaseResponse>>(
  this.baseurl + 'api/purchases/getPaginationData/' +supplierId + '/date-range',
  { params }
);
  }
  public getSupplierPaymentHistory(supplierId: number, fromDate: string, toDate: string, currentPage: number, pageSize: number): Observable<PageResponse<SupplierPaymentResponseDTO>> {
    const params = new HttpParams()
      .set('startDate', fromDate)
      .set('endDate', toDate)
      .set('size', pageSize.toString())
      .set('page', currentPage.toString());
      

    return this.http.get<PageResponse<SupplierPaymentResponseDTO>>(
      this.baseurl + 'api/supplier-payments/getbysupplierid/' + supplierId ,
      { params }
    );
  }

  public getpaymmentByIdForEdit(id:number):Observable<SupplierPayemnt>{
    return this.http.get<SupplierPayemnt>(this.baseurl+'api/supplier-payments/getbypaymentid/'+id);
  }
  public editPayment(paymentId:number,data:SupplierPayemnt):Observable<ResponseBackend>{
    return this.http.put<ResponseBackend>(this.baseurl+'api/supplier-payments/update/'+paymentId,data);
  }
}
