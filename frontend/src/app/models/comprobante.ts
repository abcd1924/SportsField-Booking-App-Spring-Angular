import { reserva } from "./reserva";

export interface comprobante {
    id: number;
    codigoComprobante: string;
    fechaEmision: string | Date;
    subtotal: number;
    total: number;
    igv: number;
    reserva: reserva;
}