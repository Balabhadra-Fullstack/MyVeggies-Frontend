import { SaleItems } from "./SaleItems";

export interface Sale{
    customerId:number | null;
    saleDate:string;
    saleItems:SaleItems[];
    crateCount:number | null;
}