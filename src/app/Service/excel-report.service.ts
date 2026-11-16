import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExcelReportService {

  constructor(private http:HttpClient) { }
   baseurl = 'http://localhost:8090/api/v1/report';
  exportExcel(
  reportType: string,
  subType: string,
  id: number,
  startDate: string,
  endDate: string
) {
  const url = this.baseurl +
    '/export/' +
    reportType + '/' +
    subType + '/' +
    id;

  const params = new HttpParams()
    .set('startDate', startDate)
    .set('endDate', endDate);

  return this.http.get(url, {
    params: params,
    responseType: 'blob'
  });
}
}
