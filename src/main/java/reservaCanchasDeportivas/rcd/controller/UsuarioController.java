package reservaCanchasDeportivas.rcd.controller;

import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import reservaCanchasDeportivas.rcd.DTO.UsuarioDTO;
import reservaCanchasDeportivas.rcd.model.Usuario;
import reservaCanchasDeportivas.rcd.service.UsuarioService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.PathVariable;

//TESTEADO CON POSTMAN
//URL: http://localhost:8080/api/usuarios
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {
    @Autowired
    private UsuarioService usuarioService;

    @GetMapping()
    public ResponseEntity<List<Usuario>> listarUsuarios() {
        List<Usuario> usuarios = usuarioService.listarUsuarios();
        return ResponseEntity.ok(usuarios);
    }

    @PostMapping("/registrar")
    public ResponseEntity<UsuarioDTO> registrarUsuario(@RequestBody Usuario usuario){
        Usuario creado = usuarioService.registrarUsuario(usuario);
        return ResponseEntity.ok(UsuarioDTO.toDTO(creado));
    }

    @PutMapping("/editar/{id}")
    public ResponseEntity<Usuario> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuarioAct, Authentication authentication){

        String rolUsuarioLogeado = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .filter(r -> r.startsWith("ROLE_"))
            .map(r -> r.replace("ROLE_", ""))
            .findFirst()
            .orElse("USER");
        Usuario actualizado = usuarioService.actualizarUsuario(id, usuarioAct, rolUsuarioLogeado);
        return ResponseEntity.ok(actualizado);
    }

    // Buscar usuario por email
    @GetMapping("/buscar/email/{email}")
    public ResponseEntity<Optional<Usuario>> buscarPorEmail(@PathVariable String email){
        Optional<Usuario> usuario = usuarioService.buscarPorEmail(email);
        if(usuario.isPresent()){
            return ResponseEntity.ok(usuario);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Optional.empty());
        }
    }

    // Verificar si existe usuario por número de documento
    @GetMapping("/existe/documento/{numDocumento}")
    public ResponseEntity<Boolean> existePorNumDocumento(@PathVariable String numDocumento){
        boolean existe = usuarioService.existePorNumDocumento(numDocumento);
        return ResponseEntity.ok(existe);
    }

    // Eliminaar usuario por ID
    @DeleteMapping("/eliminar/{id}")
    public void eliminarUsuario(@PathVariable Long id) {
        usuarioService.eliminar(id);
    }
}