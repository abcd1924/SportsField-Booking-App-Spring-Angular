package reservaCanchasDeportivas.rcd.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import reservaCanchasDeportivas.rcd.model.Usuario;
import reservaCanchasDeportivas.rcd.repository.UsuarioRepository;

@Service
public class AppUserDetailsService implements UserDetailsService{
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Usuario u = usuarioRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontradao"));
        List<GrantedAuthority> roles = List.of(new SimpleGrantedAuthority("ROLE_" + u.getRol()));
        return new org.springframework.security.core.userdetails.User(u.getEmail(), u.getPassword(), roles);
    }
}
