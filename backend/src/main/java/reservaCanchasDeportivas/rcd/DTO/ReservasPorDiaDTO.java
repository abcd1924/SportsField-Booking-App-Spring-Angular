package reservaCanchasDeportivas.rcd.DTO;

import java.time.LocalDate;

public class ReservasPorDiaDTO {
    private LocalDate fecha;
    private Long cantidad;

    public ReservasPorDiaDTO() {
    }

    public ReservasPorDiaDTO(LocalDate fecha, Long cantidad) {
        this.fecha = fecha;
        this.cantidad = cantidad;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }

    public Long getCantidad() {
        return cantidad;
    }

    public void setCantidad(Long cantidad) {
        this.cantidad = cantidad;
    }
}
