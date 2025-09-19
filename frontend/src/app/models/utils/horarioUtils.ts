export class HorarioUtils {
    static obtenerDiaSemana(fecha: Date): string {
        const dias = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO'];
        return dias[fecha.getDay()];
    }

    static formatearHora(hora: string): string {
        const [hours, minutes] = hora.split(':');
        const hour12 = parseInt(hours) % 12 || 12;
        const ampm = parseInt(hours) >= 12 ? 'PM' : 'AM';
        return `${hour12}:${minutes} ${ampm}`;
    }

    static calcularDuracionHoras(horaInicio: string, horaFin: string): number {
        const [inicioHoras, inicioMinutos] = horaInicio.split(':').map(Number);
        const [finHoras, finMinutos] = horaFin.split(':').map(Number);

        const inicioTotalMinutos = inicioHoras * 60 + inicioMinutos;
        const finTotalMinutos = finHoras * 60 + finMinutos;

        return (finTotalMinutos - inicioTotalMinutos) / 60;
    }
}