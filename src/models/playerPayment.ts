export enum PaymentStatus{
  Paid = 1,
  RequestSent = 2,
  RequestNotSent = 3
}

export interface PlayerPayment{
  playerId: string;
  status: number;
  amount: number;
}
