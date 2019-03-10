import { PlayerPayment } from "./playerPayment";

export interface Game{
  id?: string;
  date: string;
  totalCourts: number;
  payments: PlayerPayment[];
}
