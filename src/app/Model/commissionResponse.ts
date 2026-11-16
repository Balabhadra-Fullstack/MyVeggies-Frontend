import { CommissionResItemsDTO } from "./CommissionResItemsDTO";

export interface commissionResponse{
    id: number;
     suppliername: string;
  trucknumber: string;
  commission: number;
  date: string; // LocalDate format: YYYY-MM-DD
  items: CommissionResItemsDTO[];
  truckcharges: number;
  labourcharges: number;
  othercharges: number;
  supplierpayable: number;
}