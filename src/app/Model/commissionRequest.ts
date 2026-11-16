import { CommissionPurchaseItemDTO } from "./CommissionPurchaseItemDTO";

export interface CommissionRequest {
  supplierId: number | null;
  truckNumber: string;
  date: string;
  commissionRate: number | null;
  items: CommissionPurchaseItemDTO[];
  truckcharges: number | null;
  laborCharges: number | null;
  otherCharges: number | null;
}