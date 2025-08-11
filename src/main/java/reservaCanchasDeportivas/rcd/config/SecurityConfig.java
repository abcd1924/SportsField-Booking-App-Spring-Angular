package reservaCanchasDeportivas.rcd.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/canchas-deportivas/editar{id}", "/api/canchas-deportivas/crear").hasRole("ADMIN")
                .requestMatchers("/api/horarios-canchas/crear", "/api/horarios-canchas/editar/{id}").hasAnyRole("ADMIN", "RECEPCIONISTA")
                .requestMatchers("/api/reservas/crear", "/api/reservas/confirmar/{id}", "/api/reservas/cancelar/{id}", "/api/reservas/buscar/futuras-confirmadas").hasAnyRole("ADMIN", "RECEPCIONISTA")
                .requestMatchers("/api/comprobantes/crear").hasAnyRole("ADMIN", "RECEPCIONISTA")
                .requestMatchers("/api/usuarios/editar/{id}").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/usuarios/buscar/email/{email}", "/api/usuarios/existe/documento/{numDocumento}").hasAnyRole("ADMIN", "RECEPCIONISTA")
                .anyRequest().permitAll()
            )
                .formLogin();
        return http.build();
    }
}