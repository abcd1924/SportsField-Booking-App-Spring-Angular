import { canchaDeportiva } from "./canchaDeportiva";
import { User } from "./user";

export interface reserva {
    id: number;
    codUnico: string;
    horasTotales: number;
    estado: string;
    fechaCreacionReserva: Date;
    fechaInicio: Date;
    fechaFin: Date;
    userId: number;
    canchaDeportivaId: number;
}