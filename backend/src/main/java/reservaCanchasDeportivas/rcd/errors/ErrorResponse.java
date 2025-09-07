package reservaCanchasDeportivas.rcd.errors;

import java.util.ArrayList;
import java.util.List;

public class ErrorResponse {
    private boolean success;
    private String message;
    private List<FieldError> fieldErrors;
    private int status;
    private long timestamp;

    public ErrorResponse() {
        this.success = false;
        this.fieldErrors = new ArrayList<>();
        this.timestamp = System.currentTimeMillis();
    }

    public ErrorResponse(String message, int status) {
        this();
        this.message = message;
        this.status = status;
    }

    // Método para agregar errores de campo fácilmente
    public void addFieldError(String field, String message) {
        this.fieldErrors.add(new FieldError(field, message));
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<FieldError> getFieldErrors() {
        return fieldErrors;
    }

    public void setFieldErrors(List<FieldError> fieldErrors) {
        this.fieldErrors = fieldErrors;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}