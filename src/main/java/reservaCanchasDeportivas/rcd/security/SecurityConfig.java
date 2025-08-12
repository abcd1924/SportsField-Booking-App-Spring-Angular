package reservaCanchasDeportivas.rcd.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
            .csrf().disable()
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/canchas-deportivas/editar{id}", "/api/canchas-deportivas/crear").hasRole("ADMIN")
                .requestMatchers("/api/horarios-canchas/crear", "/api/horarios-canchas/editar/{id}").hasAnyRole("ADMIN", "RECEPCIONISTA")
                .requestMatchers("/api/reservas/crear", "/api/reservas/confirmar/{id}", "/api/reservas/cancelar/{id}", "/api/reservas/buscar/futuras-confirmadas").hasAnyRole("ADMIN", "RECEPCIONISTA")
                .requestMatchers("/api/comprobantes/crear").hasAnyRole("ADMIN", "RECEPCIONISTA")
                .requestMatchers("/api/usuarios/editar/{id}").hasAnyRole("USER", "ADMIN")
                .requestMatchers("/api/usuarios/buscar/email/{email}", "/api/usuarios/existe/documento/{numDocumento}", "api/usuarios").hasAnyRole("ADMIN", "RECEPCIONISTA")
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            );
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}