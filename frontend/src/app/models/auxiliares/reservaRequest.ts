import { canchaDeportiva } from "../canchaDeportiva";

export interface ReservaRequest {
    canchaDeportiva: { id: number };
    usuario: { id: number };
    fechaInicio: Date;
    fechaFin: Date;
}