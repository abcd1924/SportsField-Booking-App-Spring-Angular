export interface HorarioDisponibilidadDTO {
  id: number;
  diaSemana: string;
  horaInicio: string;
  horaFin: string;
  disponible: boolean;
  motivoNoDisponible: string | null;
}