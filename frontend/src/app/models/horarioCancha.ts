import { canchaDeportiva } from "./canchaDeportiva";

export interface horarioCancha {
    id: number;
    diaSemana: string;
    horaInicio: string;
    horaFin: string;
    disponible: boolean;
    canchaDeportiva: canchaDeportiva;
}