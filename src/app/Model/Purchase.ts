import { PurchaseItems } from "./PurchaseItems";

export interface Purchase{
    supplierId:number | null;
    vehiclename:string;

    entryDateTime:string;

    truckWeight:number | null;

     purchaseItems:PurchaseItems[];

}