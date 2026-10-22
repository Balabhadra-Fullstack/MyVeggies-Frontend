export interface SupplierPaymentResponseDTO {
  paymentId: number | null;
  supplierId: number | null;
  supplierName: string;
  amount: number | null;
  method: string;
  dateTime: string | null;
}
