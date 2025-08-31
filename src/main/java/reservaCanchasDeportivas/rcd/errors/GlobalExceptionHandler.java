package reservaCanchasDeportivas.rcd.errors;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    // Este método captura las violaciones de constraints únicos y las convierte en mensajes amigables para el usuario
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleUniqueConstraintViolation(DataIntegrityViolationException ex) {
        ErrorResponse errorResponse = new ErrorResponse("Error de validación", HttpStatus.CONFLICT.value());

        String errorMessage = ex.getMessage().toLowerCase();

        if(errorMessage.contains("email")) {
            errorResponse.addFieldError("email", "Este email ya está registrado. Por favor, usa otro email");
        } else if (errorMessage.contains("numDocumento") || errorMessage.contains("num_documento")) {
            errorResponse.addFieldError("numDocumento", "Este número de documento ya está registrado en el sistema");
        } else {
            errorResponse.setMessage("Ya existe un registro con estos datos. Por favor, verifica la información ingresada.");
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body(errorResponse);
    }

    // Este método maneja los errores de validación de Bean Validation (@Notblank, @Email, etc.)
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationErrors(MethodArgumentNotValidException ex) {
        ErrorResponse errorResponse = new ErrorResponse("Errores de validación en el formulario", HttpStatus.BAD_REQUEST.value());

        for (org.springframework.validation.FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            errorResponse.addFieldError(fieldError.getField(), fieldError.getDefaultMessage());
        }

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    // Maneja cualquier otra excepción no prevista
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericError(Exception ex) {
        ErrorResponse errorResponse = new ErrorResponse(
            "Ha ocurrido un error inesperado. Por favor, intenta nuevamente.",
            HttpStatus.INTERNAL_SERVER_ERROR.value()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}