export class ReservaUtils {
    // Valida si una fecha/hora está disponible para reserva
    static esFechaHoraValida(fechaInicio: Date, fechaFin: Date): { valida: boolean; error?: string } {
        const ahora = new Date();

        if (fechaInicio <= ahora) {
            return { valida: false, error: 'La fecha de inicio debe ser futura' };
        }

        if (fechaFin <= fechaInicio) {
            return { valida: false, error: 'La fecha de fin debe ser posterior a la de inicio' };
        }

        const maxFecha = new Date();
        maxFecha.setDate(maxFecha.getDate() + 30);

        if (fechaInicio > maxFecha) {
            return { valida: false, error: 'Solo se pueden hacer reservas con máximo 30 días de anticipación' };
        }

        return { valida: true };
    }

    // Formatea duración en horas de forma legible
    static formatearDuracion(horas: number): string {
        if (horas < 1) {
            return `${Math.round(horas * 60)} minutos`;
        } else if (horas === 1) {
            return '1 hora';
        } else {
            return `${horas} horas`;
        }
    }

    // Convierte fechas para enviar al backend
    static prepararFechasParaBackend(fecha: string, horaInicio: string, horaFin: string): {
        fechaInicio: Date;
        fechaFin: Date;
    } {
        const fechaInicio = new Date(`${fecha}T${horaInicio}:00`);
        const fechaFin = new Date(`${fecha}T${horaFin}:00`);

        return { fechaInicio, fechaFin };
    }
}