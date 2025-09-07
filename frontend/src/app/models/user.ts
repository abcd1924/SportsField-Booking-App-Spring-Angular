export interface User {
    id?: number;
    nombre: string;
    apellido: string;
    email: string;
    rol: 'ADMIN' | 'RECEPCIONISTA' | 'USER';
    telefono: string;
    tipoDocumento: string;
    numDocumento: string;
    fechaNacimiento: Date;
    genero: string;
    password: string;
}