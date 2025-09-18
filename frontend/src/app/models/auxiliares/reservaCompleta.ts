import { canchaDeportiva } from "../canchaDeportiva";
import { comprobante } from "../comprobante";
import { reserva } from "../reserva";
import { User } from "../user";

export interface ReservaCompleta {
    reserva: reserva;
    cancha: canchaDeportiva;
    usuario: User;
    comprobante?: comprobante;
}