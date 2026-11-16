import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CommissionRequest } from '../Model/commissionRequest';
import { ResponseBackend } from '../Model/ResponseBackend';
import { commissionResponse } from '../Model/commissionResponse';
import { PageResponse } from '../Model/PageResponse';

@Injectable({
  providedIn: 'root'
})
export class CommissionpurchaseService {
  
  public baseurl = 'http://localhost:8090/api/commission-purchases';

  constructor(private http: HttpClient) { }

  public addCommissionPurchase(data: CommissionRequest): Observable<ResponseBackend> {
    return this.http.post<ResponseBackend>(`${this.baseurl}/add`, data);
  }
  public  getRecent30CommissionPurchasesBySupplier(supplierId: number):Observable<any>{
return this.http.get<any>(this.baseurl + `/top30/${supplierId}`);
  } 
   public getcommissionByid(commissionId:number):Observable<any>{
    return this.http.get<any>(this.baseurl+'/get/'+commissionId);
   }
   public getRecent3CommissionPurchaseBySupplier(supplierId:number):Observable<commissionResponse[]>{
    return this.http.get<commissionResponse[]>(this.baseurl+'/top3/'+supplierId)
   }
   public getCommissionPurchasesBetweenDates(supplierId: number, fromDate: string, toDate: string, currentPage: number, pageSize: number):Observable<PageResponse<commissionResponse>> {
 const params = new HttpParams()
    .set('startDate', fromDate)
    .set('endDate', toDate)
    .set('page', currentPage.toString())
    .set('size', pageSize.toString());

    return this.http.get<PageResponse<commissionResponse>>(
  this.baseurl + '/getPaginationData/' + supplierId + '/date-range',
  { params }
);
  }
  public updatecommissionpurchase(purchaseId:number,data:any):Observable<ResponseBackend>{
    return this.http.put<ResponseBackend>(this.baseurl+'/update/'+purchaseId,data);
  }
}
