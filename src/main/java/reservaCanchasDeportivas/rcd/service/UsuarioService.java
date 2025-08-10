package reservaCanchasDeportivas.rcd.service;

import java.util.List;
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

        if(usuarioRepository.existsByNumDocumento(usuario.getNumDocumento())){
            throw new IllegalArgumentException("El número de documento ya está registrado");
        }

        //Encriptar contraseña (falta implementar)

        //Asignar rol por defecto
        usuario.setRol("USER");
        
        return usuarioRepository.save(usuario);
    }

    public Optional <Usuario> buscarPorEmail(String email) {
        return usuarioRepository.findByEmail(email);
    }

    public List<Usuario> listarUsuarios(){
        return usuarioRepository.findAll();
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
        usuarioExistente.setTipoDocumento(usuarioAct.getTipoDocumento());
        usuarioExistente.setNumDocumento(usuarioAct.getNumDocumento());
        usuarioExistente.setEmail(usuarioAct.getEmail());
        usuarioExistente.setFechaNacimiento(usuarioAct.getFechaNacimiento());
        usuarioExistente.setTelefono(usuarioAct.getTelefono());
        usuarioExistente.setGenero(usuarioAct.getGenero());
        usuarioExistente.setPassword(usuarioAct.getPassword());
        usuarioExistente.setRol(usuarioAct.getRol());

        return usuarioRepository.save(usuarioExistente);
    }
}