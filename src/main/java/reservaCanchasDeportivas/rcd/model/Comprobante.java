package reservaCanchasDeportivas.rcd.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "comprobantes")
public class Comprobante {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime fecha_emision;

    @Column(nullable = false)
    private double subtotal;

    @Column(nullable = false)
    private double total;

    @Column(nullable = false)
    private double igv;

    @OneToOne
    @JoinColumn(name = "reserva_id", nullable = false)
    private Reserva reserva;

    //Constructor
    public Comprobante() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getFecha_emision() {
        return fecha_emision;
    }

    public void setFecha_emision(LocalDateTime fecha_emision) {
        this.fecha_emision = fecha_emision;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public Reserva getReserva() {
        return reserva;
    }

    public void setReserva(Reserva reserva) {
        this.reserva = reserva;
    }

    public double getIgv() {
        return igv;
    }

    public void setIgv(double igv) {
        this.igv = igv;
    }    

    
}
