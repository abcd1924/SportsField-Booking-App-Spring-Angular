package reservaCanchasDeportivas.rcd.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import reservaCanchasDeportivas.rcd.model.Usuario;
import reservaCanchasDeportivas.rcd.repository.UsuarioRepository;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public Usuario registrarUsuario(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        if (usuarioRepository.existsByNumDocumento(usuario.getNumDocumento())) {
            throw new IllegalArgumentException("El número de documento ya está registrado");
        }

        usuario.setPassword(passwordEncoder.encode(usuario.getPassword()));
        usuario.setRol("USER");

        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    public boolean existePorNumDocumento(String numDocumento) {
        return usuarioRepository.existsByNumDocumento(numDocumento);
    }

    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioAct, String rolActUsuarioLogeado) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario con id " + id + " no encontrado"));

        // Bloquear cambios de ROL si no es ADMIN
        if (!"ADMIN".equals(rolActUsuarioLogeado)) {
            usuarioAct.setRol(usuarioExistente.getRol());
        }

        String nuevaContrasena = usuarioAct.getPassword();

        if (nuevaContrasena != null && !nuevaContrasena.isEmpty()) {
            usuarioExistente.setPassword(passwordEncoder.encode(nuevaContrasena));
        }

        usuarioExistente.setNombre(usuarioAct.getNombre());
        usuarioExistente.setApellido(usuarioAct.getApellido());
        usuarioExistente.setTelefono(usuarioAct.getTelefono());
        usuarioExistente.setGenero(usuarioAct.getGenero());
        usuarioExistente.setRol(usuarioAct.getRol());

        return usuarioRepository.save(usuarioExistente);
    }

    public void eliminar(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se puede eliminar. Usuario no encontrado con ID: " + id));

        usuarioRepository.deleteById(id);
    }

    public Optional<Usuario> buscarPorId(Long id) {
        return usuarioRepository.findById(id);
    }

    // Método para el dashboard: contar usuarios nuevos en un rango de fechas
    public Long contarUsuariosNuevos(LocalDateTime inicio, LocalDateTime fin) {
        return usuarioRepository.countByFechaCreacionBetween(inicio, fin);
    }

    // Logging de eventos
    private static final Logger logger = LoggerFactory.getLogger(UsuarioService.class);

    public void logInicioSesion(String email) {
        logger.info("Inicio de sesión exitoso para: {}", email);
    }

    public void logCierreSesion(String email) {
        logger.info("Cierre de sesión para: {}", email);
    }

    public void logCambioDeRol(Long id, String rolAntiguo, String rolNuevo) {
        logger.warn("Cambio de rol para usuario {}: {} -> {}", id, rolAntiguo, rolNuevo);
    }

    public void logIntentoFallido(String email) {
        logger.warn("Intento de inicio de sesión fallido para: {}", email);
    }
}