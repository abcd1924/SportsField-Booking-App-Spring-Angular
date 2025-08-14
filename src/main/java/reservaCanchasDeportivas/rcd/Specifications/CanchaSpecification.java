package reservaCanchasDeportivas.rcd.Specifications;

import java.math.BigDecimal;

import org.springframework.data.jpa.domain.Specification;

import reservaCanchasDeportivas.rcd.model.CanchaDeportiva;

public class CanchaSpecification {

    public static Specification<CanchaDeportiva> conTipo(String tipoCancha){
        return (root, query, cb) ->
            tipoCancha == null ? null : cb.equal(root.get("tipoCancha"), tipoCancha);
    }

    public static Specification<CanchaDeportiva> conPrecioEntre(BigDecimal min, BigDecimal max){
        return (root, query, cb) -> {
            if(min == null && max == null) return null;
            if(min != null && max != null) return cb.between(root.get("precioPorHora"), min, max);
            if(min != null) return cb.greaterThanOrEqualTo(root.get("precioPoeHora"), min);
            return cb.lessThanOrEqualTo(root.get("precioPorHora"), max);
        };
    }

    public static Specification<CanchaDeportiva> conCapacidadMinima(Integer capacidad){
        return (root, query, cb) ->
            capacidad == null ? null : cb.greaterThanOrEqualTo(root.get("capacidadJugadores"), capacidad);
    }

    public static Specification<CanchaDeportiva> conIluminacion(String iluminacion){
        return (root, query, cb) ->
            iluminacion == null ? null : cb.equal(root.get("iluminacion"), iluminacion);
    }

    public static Specification<CanchaDeportiva> conEstado(String estado){
        return (root, query, cb) ->
            estado == null ? null : cb.equal(root.get("estado"), estado);
    }
}
