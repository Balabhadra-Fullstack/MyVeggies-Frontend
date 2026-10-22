import { SaleItemsResponse } from "./SaleItemsResponse";

export interface SaleResponse{
    saleId:number,
    customername:String,
    saleDate:number,
    saleItems:SaleItemsResponse[],
    totalsaleAmount:number,
}