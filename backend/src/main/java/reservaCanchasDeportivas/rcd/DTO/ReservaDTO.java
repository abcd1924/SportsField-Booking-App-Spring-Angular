package reservaCanchasDeportivas.rcd.DTO;

import java.time.LocalDateTime;

public class ReservaDTO {
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private Long canchaDeportivaId;
    private Long usuarioId;

    public ReservaDTO() {
    }

    public ReservaDTO(LocalDateTime fechaInicio, LocalDateTime fechaFin, Long canchaDeportivaId, Long usuarioId) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.canchaDeportivaId = canchaDeportivaId;
        this.usuarioId = usuarioId;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Long getCanchaDeportivaId() {
        return canchaDeportivaId;
    }

    public void setCanchaDeportivaId(Long canchaDeportivaId) {
        this.canchaDeportivaId = canchaDeportivaId;
    }

    public Long getUsuarioId() {
        return usuarioId;
    }

    public void setUsuarioId(Long usuarioId) {
        this.usuarioId = usuarioId;
    }

}