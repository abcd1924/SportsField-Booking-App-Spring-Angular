package reservaCanchasDeportivas.rcd.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import reservaCanchasDeportivas.rcd.model.AuthRequest;
import reservaCanchasDeportivas.rcd.model.Usuario;
import reservaCanchasDeportivas.rcd.repository.UsuarioRepository;
import reservaCanchasDeportivas.rcd.security.JwtUtil;
import reservaCanchasDeportivas.rcd.service.AppUserDetailsService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authManager;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    AppUserDetailsService uds;

    @Autowired
    UsuarioRepository usuarioRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        Authentication auth = authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
        UserDetails user = (UserDetails) auth.getPrincipal();
        Usuario usuario = usuarioRepository.findByEmail(req.getEmail())
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));
        
        String token = jwtUtil.generateToken(user, usuario);
        return ResponseEntity.ok(Map.of("accessToken", token, "tokenType", "Bearer"));
    }
}