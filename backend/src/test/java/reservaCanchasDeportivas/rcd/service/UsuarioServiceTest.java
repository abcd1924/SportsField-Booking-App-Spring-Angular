package reservaCanchasDeportivas.rcd.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import java.time.LocalDate;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;
import reservaCanchasDeportivas.rcd.model.Usuario;
import reservaCanchasDeportivas.rcd.repository.UsuarioRepository;

@ExtendWith(MockitoExtension.class)
public class UsuarioServiceTest {

    @Mock
    private UsuarioRepository usuarioRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UsuarioService usuarioService;

    @Test
    void registrarUsuario_Exitoso() {
        Usuario usuarioNuevo = new Usuario();
        usuarioNuevo.setEmail("nuevo@test.com");
        usuarioNuevo.setPassword("Contra123.");
        usuarioNuevo.setTipoDocumento("DNI");
        usuarioNuevo.setNumDocumento("12345678");
        usuarioNuevo.setNombre("Usuario");
        usuarioNuevo.setApellido("Test");
        usuarioNuevo.setTelefono("987654321");
        usuarioNuevo.setFechaNacimiento(LocalDate.of(2000, 1, 1));
        usuarioNuevo.setGenero("Masculino");

        Usuario usuarioGuardado = new Usuario();
        usuarioGuardado.setId(1L);
        usuarioGuardado.setEmail(usuarioNuevo.getEmail());
        usuarioGuardado.setRol("USER");
        usuarioGuardado.setPassword("encodedPassword");

        when(usuarioRepository.existsByEmail(usuarioNuevo.getEmail())).thenReturn(false);
        when(usuarioRepository.existsByNumDocumento(usuarioNuevo.getNumDocumento())).thenReturn(false);
        when(passwordEncoder.encode(usuarioNuevo.getPassword())).thenReturn("encodedPassword");
        when(usuarioRepository.save(any(Usuario.class))).thenReturn(usuarioGuardado);

        Usuario resultado = usuarioService.registrarUsuario(usuarioNuevo);

        assertNotNull(resultado);
        assertEquals(1L, resultado.getId());
        assertEquals("USER", resultado.getRol());
        assertEquals("encodedPassword", resultado.getPassword());

        verify(usuarioRepository).existsByEmail("nuevo@test.com");
        verify(usuarioRepository).existsByNumDocumento("12345678");
        verify(passwordEncoder).encode("Contra123.");
        verify(usuarioRepository).save(any(Usuario.class));
    }

    @Test
    void registrarUsuario_FallaPorEmailExistente() {
        Usuario usuarioExistente = new Usuario();
        usuarioExistente.setEmail("existente@test.com");
        usuarioExistente.setPassword("Contra123.");
        usuarioExistente.setNumDocumento("87654321");

        when(usuarioRepository.existsByEmail("existente@test.com")).thenReturn(true);

        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            usuarioService.registrarUsuario(usuarioExistente);
        });

        assertEquals("El email ya está registrado", exception.getMessage());

        verify(usuarioRepository, never()).save(any(Usuario.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void buscarPorEmail_EncuentraUsuario() {
        Usuario usuarioEncontrado = new Usuario();
        usuarioEncontrado.setId(1L);
        usuarioEncontrado.setEmail("test@test.com");
        when(usuarioRepository.findByEmail("test@test.com")).thenReturn(Optional.of(usuarioEncontrado));

        Optional<Usuario> usuarioBuscado = usuarioService.buscarPorEmail("test@test.com");

        assertTrue(usuarioBuscado.isPresent());
        assertEquals("test@test.com", usuarioBuscado.get().getEmail());
        verify(usuarioRepository).findByEmail("test@test.com");
    }

    @Test
    void buscarPorEmail_NoEncuentraUsuario() {
        when(usuarioRepository.findByEmail("noexiste@test.com")).thenReturn(Optional.empty());

        Optional<Usuario> usuarioBuscado = usuarioService.buscarPorEmail("noexiste@test.com");

        assertFalse(usuarioBuscado.isPresent());
        verify(usuarioRepository).findByEmail("noexiste@test.com");
    }
}