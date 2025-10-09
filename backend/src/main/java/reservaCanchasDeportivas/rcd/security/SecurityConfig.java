package reservaCanchasDeportivas.rcd.security;

import java.util.List;

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
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthFilter jwtAuthFilter) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(request -> {
                    var corsConfig = new CorsConfiguration();
                    corsConfig.setAllowedOrigins(List.of("http://localhost:4200")); // Frontend Angular
                    corsConfig.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
                    corsConfig.setAllowedHeaders(List.of("*"));
                    corsConfig.setAllowCredentials(true);
                    return corsConfig;
                }))
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/canchas-deportivas/editar/{id}", "/api/canchas-deportivas/crear")
                        .hasRole("ADMIN")
                        .requestMatchers("/api/horarios-canchas/crear", "/api/horarios-canchas/editar/{id}")
                        .hasAnyRole("ADMIN", "RECEPCIONISTA")
                        .requestMatchers("/api/reservas/crear",
                                "/api/reservas/buscar/futuras-confirmadas")
                        .hasAnyRole("ADMIN", "RECEPCIONISTA")
                        .requestMatchers("/api/comprobantes/crear", "/api/comprobantes/generar/{reservaId}",
                                "/api/comprobantes/buscar/reservaId/{reservaId}",
                                "/api/comprobantes/descargar/{comprobanteId}", "/api/reservas/crear-temporal", "/api/reservas/confirmar/{id}", "/api/reservas/cancelar/{id}")
                        .hasAnyRole("ADMIN", "RECEPCIONISTA", "USER")
                        .requestMatchers("/api/usuarios/editar/{id}").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/api/usuarios/existe/documento/{numDocumento}", "/api/usuarios")
                        .hasAnyRole("ADMIN", "RECEPCIONISTA")
                        .requestMatchers("/api/usuarios/buscar/email/{email}")
                        .authenticated()
                        .requestMatchers("/api/auth/login", "/api/usuarios/registrar", "/api/canchas-deportivas",
                                "/api/canchas-deportivas/activas", "/api/horarios-canchas", "/api/horarios-canchas/disponibles-por-fecha",
                                "/api/canchas-deportivas/buscar/{id}", "/api/horarios-canchas/buscar/**")
                        .permitAll()
                        .anyRequest().authenticated());
        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}