import { SaleItemsResponse } from "./SaleItemsResponse";

export interface SaleResponse {
  saleId: number;
  customername: string;
  saleDate: string;
  saleItems: SaleItemsResponse[];
  totalsaleAmount: number;
}