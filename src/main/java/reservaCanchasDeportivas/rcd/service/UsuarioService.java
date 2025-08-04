package reservaCanchasDeportivas.rcd.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import reservaCanchasDeportivas.rcd.model.Usuario;
import reservaCanchasDeportivas.rcd.repository.UsuarioRepository;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;

    /*
    @Autowired
    private PasswordEncoder passwordEncoder;
    */

    public Usuario registrarUsuario(Usuario usuario) {
        if(usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }

        //Encriptar contraseña (falta implementar)

        //Asignar rol por defecto
        usuario.setRol("USER");
        
        return usuarioRepository.save(usuario);
    }

    public Optional <Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public boolean existePorNumDocumento(String numDocumento){
        return usuarioRepository.existsByNumDocumento(numDocumento);
    }

    public Usuario guardarUsuario(Usuario usuario) {
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioAct) {
        Usuario usuarioExistente = usuarioRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuario con id " +id+ " no encontrado"));

        usuarioExistente.setNombre(usuarioAct.getNombre());
        usuarioExistente.setApellido(usuarioAct.getApellido());
        usuarioExistente.setTipo_documento(usuarioAct.getTipo_documento());
        usuarioExistente.setNum_documento(usuarioAct.getNum_documento());
        usuarioExistente.setEmail(usuarioAct.getEmail());
        usuarioExistente.setFecha_nacimiento(usuarioAct.getFecha_nacimiento());
        usuarioExistente.setTelefono(usuarioAct.getTelefono());
        usuarioExistente.setGenero(usuarioAct.getGenero());

        return usuarioRepository.save(usuarioExistente);
    }
}
