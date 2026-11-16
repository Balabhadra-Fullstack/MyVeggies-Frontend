import { PurchaseItemRes } from "./PurchaseItemRes";

export interface PurchaseResponse{
      purchaseId: number;
  suppliername: string;
  vehicleNumber: string;
  entryDate: string;
  truckWeight: number;
  purchaseItems: PurchaseItemRes[];
  netAmount: number;
}