import { SaleItemsResponse } from "./SaleItemsResponse";

export interface SaleResponseWithCrate{
      saleId: number;
      customerId: number;
      customername: string;
      saleDate: string;
      saleItems: SaleItemsResponse[];
      crateCount: number;
      totalsaleAmount: number;
    
}