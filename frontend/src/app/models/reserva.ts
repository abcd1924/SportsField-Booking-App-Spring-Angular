export interface reserva {
    id: number;
    codUnico: string;
    horasTotales: number;
    estado: string;
    fechaCreacionReserva: Date;
    fechaInicio: Date;
    fechaFin: Date;
    usuario: {
        id: number,
        nombre: string;
        apellido: string;
        email: string;
        telefono?: string;
    };
    canchaDeportiva: {
        id: number;
        tipoCancha: string;
        numeroCancha: string;
        precioPorHora: number;
        capacidadJugadores: number;
        tipoGrass: string;
        descripcion?: string;
    };

}