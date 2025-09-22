export interface decodeToken {
  sub: string;
  userId?: number;
  roles: string[];
  nombre: string;
  apellido: string;
  fechaNacimiento: string;
  tipoDocumento: string;
  numDocumento: string;
  telefono: string;
  genero: string;
  exp: number;
  iat: number;
  jti: string;
}