package reservaCanchasDeportivas.rcd.model;

import jakarta.persistence.*;

@Entity
@Table(name = "canchas_deportivas")
public class CanchaDeportiva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipoCancha;

    @Column(nullable = false, unique = true)
    private String numeroCancha;

    @Column(nullable = false)
    private double precioPorHora;

    @Column(nullable = false)
    private int capacidadJugadores;

    @Column(nullable = false)
    private String tipoGrass;

    private String descripcion;

    @Column(nullable = false)
    private String estado;

    @Column(nullable = false)
    private String iluminacion;

    // Constructor
    public CanchaDeportiva() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTipoCancha() {
        return tipoCancha;
    }

    public void setTipoCancha(String tipoCancha) {
        this.tipoCancha = tipoCancha;
    }

    public String getNumeroCancha() {
        return numeroCancha;
    }

    public void setNumeroCancha(String numeroCancha) {
        this.numeroCancha = numeroCancha;
    }

    public double getPrecioPorHora() {
        return precioPorHora;
    }

    public void setPrecioPorHora(double precioPorHora) {
        this.precioPorHora = precioPorHora;
    }

    public int getCapacidadJugadores() {
        return capacidadJugadores;
    }

    public void setCapacidadJugadores(int capacidadJugadores) {
        this.capacidadJugadores = capacidadJugadores;
    }

    public String getTipoGrass() {
        return tipoGrass;
    }

    public void setTipoGrass(String tipoGrass) {
        this.tipoGrass = tipoGrass;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getIluminacion() {
        return iluminacion;
    }

    public void setIluminacion(String iluminacion) {
        this.iluminacion = iluminacion;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }
    
}
