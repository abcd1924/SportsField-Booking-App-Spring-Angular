package reservaCanchasDeportivas.rcd.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "reservas")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "El código no puede estar vacío")
    @Column(nullable = false, unique = true)
    private String cod_unico;

    @Column(nullable = false)
    private int horas_totales;

    @NotBlank(message = "Escoga un estado")
    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private LocalDateTime fecha_creacion_reserva = LocalDateTime.now();

    @Column(nullable = false)
    private LocalDateTime fecha_inicio;

    @Column(nullable = false)
    private LocalDateTime fecha_fin;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "cancha_deportiva_id", nullable = false)
    private CanchaDeportiva canchaDeportiva;

    //Constructor
    public Reserva() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCod_unico() {
        return cod_unico;
    }

    public void setCod_unico(String cod_unico) {
        this.cod_unico = cod_unico;
    }

    public int getHoras_totales() {
        return horas_totales;
    }

    public void setHoras_totales(int horas_totales) {
        this.horas_totales = horas_totales;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public LocalDateTime getFecha_creacion_reserva() {
        return fecha_creacion_reserva;
    }

    public void setFecha_creacion_reserva(LocalDateTime fecha_creacion_reserva) {
        this.fecha_creacion_reserva = fecha_creacion_reserva;
    }

    public LocalDateTime getFecha_inicio() {
        return fecha_inicio;
    }

    public void setFecha_inicio(LocalDateTime fecha_inicio) {
        this.fecha_inicio = fecha_inicio;
    }

    public LocalDateTime getFecha_fin() {
        return fecha_fin;
    }

    public void setFecha_fin(LocalDateTime fecha_fin) {
        this.fecha_fin = fecha_fin;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public CanchaDeportiva getCanchaDeportiva() {
        return canchaDeportiva;
    }

    public void setCanchaDeportiva(CanchaDeportiva canchaDeportiva) {
        this.canchaDeportiva = canchaDeportiva;
    }

    
}
