package reservaCanchasDeportivas.rcd.model;

import jakarta.persistence.*;

@Entity
@Table(name = "canchas_deportivas")
public class CanchaDeportiva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String tipo_cancha;

    @Column(nullable = false, unique = true)
    private String numero_cancha;

    @Column(nullable = false)
    private double precio_por_hora;

    @Column(nullable = false)
    private int capacidad_jugadores;

    @Column(nullable = false)
    private String tipo_grass;

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

    public String getTipo_cancha() {
        return tipo_cancha;
    }

    public void setTipo_cancha(String tipo_cancha) {
        this.tipo_cancha = tipo_cancha;
    }

    public String getNumero_cancha() {
        return numero_cancha;
    }

    public void setNumero_cancha(String numero_cancha) {
        this.numero_cancha = numero_cancha;
    }

    public double getPrecio_por_hora() {
        return precio_por_hora;
    }

    public void setPrecio_por_hora(double precio_por_hora) {
        this.precio_por_hora = precio_por_hora;
    }

    public int getCapacidad_jugadores() {
        return capacidad_jugadores;
    }

    public void setCapacidad_jugadores(int capacidad_jugadores) {
        this.capacidad_jugadores = capacidad_jugadores;
    }

    public String getTipo_grass() {
        return tipo_grass;
    }

    public void setTipo_grass(String tipo_grass) {
        this.tipo_grass = tipo_grass;
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
