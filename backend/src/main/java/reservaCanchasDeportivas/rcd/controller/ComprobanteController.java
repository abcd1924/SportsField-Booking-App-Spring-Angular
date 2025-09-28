package reservaCanchasDeportivas.rcd.controller;

import org.springframework.http.HttpHeaders;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import reservaCanchasDeportivas.rcd.model.Comprobante;
import reservaCanchasDeportivas.rcd.service.ComprobanteService;
import reservaCanchasDeportivas.rcd.service.PDFService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

//TESTEADO CON POSTMAN
//URL: http://localhost:8080/api/comprobantes
@RestController
@RequestMapping("/api/comprobantes")
public class ComprobanteController {
    @Autowired
    private ComprobanteService comprobanteService;

    @Autowired
    private PDFService pdfService;

    private static final Logger logger = LoggerFactory.getLogger(ComprobanteController.class);

    @GetMapping
    public ResponseEntity<List<Comprobante>> listarComprobantes() {
        List<Comprobante> comprobantes = comprobanteService.listarComprobantes();
        return ResponseEntity.ok(comprobantes);
    }

    @PostMapping("/generar/{reservaId}")
    public ResponseEntity<Comprobante> generarComprobante(@PathVariable Long reservaId) {
        try {
            Comprobante comprobante = comprobanteService.generarComprobantePorReservaId(reservaId);
            return ResponseEntity.status(HttpStatus.CREATED).body(comprobante);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    // Buscar comprobante por reservaId
    @GetMapping("/buscar/reservaId/{reservaId}")
    public ResponseEntity<Comprobante> obtenerComprobantePorReservaId(@PathVariable Long reservaId) {
        Optional<Comprobante> comprobante = comprobanteService.obtenerPorReservaId(reservaId);
        if (comprobante.isPresent()) {
            return ResponseEntity.ok(comprobante.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Buscar comprobantes por rango de fechas
    @GetMapping("/buscar/fechaEmisionEntre")
    public ResponseEntity<List<Comprobante>> obtenerComprobantesPorFechaEmisionEntre(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        List<Comprobante> comprobantes = comprobanteService.obtenerComprobantesPorFechaEmisionEntre(inicio, fin);
        return ResponseEntity.ok(comprobantes);
    }

    // Descargar comprobante como PDF
    @GetMapping("/descargar/{comprobanteId}")
    public ResponseEntity<byte[]> descargarComprobantePDF(@PathVariable Long comprobanteId) {
        try {
            Optional<Comprobante> comprobanteOpt = comprobanteService.obtenerComprobantePorId(comprobanteId);
            if (!comprobanteOpt.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            byte[] pdfBytes = pdfService.generarComprobantePDF(comprobanteOpt.get());

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                    .filename("comprobante-" + comprobanteOpt.get().getCodigoComprobante() + ".pdf")
                    .build());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdfBytes);
        } catch (Exception e) {
            logger.error("Error descargando PDF del comprobante ID: " + comprobanteId, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}