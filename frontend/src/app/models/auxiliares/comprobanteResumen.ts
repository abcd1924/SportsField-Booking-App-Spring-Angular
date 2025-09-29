export interface ComprobanteResumen {
    id: number;
    codigoComprobante: string;
    fechaEmision: string;
    total: number;
    nombreCliente: string;
    tipoCancha: string;
    numeroCancha: string;
}