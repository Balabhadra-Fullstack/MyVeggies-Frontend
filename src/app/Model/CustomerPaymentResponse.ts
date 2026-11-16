export interface CustomerPaymentResponse{
    paymentId:number;
    customerId:number;
    customerName:string;
    amount:number;
    method:string;
    dateTime:string;
}