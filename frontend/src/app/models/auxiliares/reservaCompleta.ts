import { reserva } from "../reserva";

export interface ReservaCompleta {
    reserva: reserva;
    cancha?: {
        numeroCancha: string;
        tipoCancha: string;
        precioPorHora: number;
    }
    usuario?: {
    nombre: string;
    apellido: string;
    email: string;
  };
}