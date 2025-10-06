package reservaCanchasDeportivas.rcd.errors;

public class HorarioNoDisponibleException extends RuntimeException {

    public HorarioNoDisponibleException(String mensaje) {
        super(mensaje);
    }
}