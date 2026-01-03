package reservaCanchasDeportivas.rcd.service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import org.apache.pdfbox.pdmodel.*;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDFont;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import reservaCanchasDeportivas.rcd.model.CanchaDeportiva;
import reservaCanchasDeportivas.rcd.model.Comprobante;
import reservaCanchasDeportivas.rcd.model.Reserva;
import reservaCanchasDeportivas.rcd.model.Usuario;

@Service
public class PDFService {
        private static final Logger logger = LoggerFactory.getLogger(PDFService.class);

        public byte[] generarComprobantePDF(Comprobante comprobante) {
                try (PDDocument documento = new PDDocument()) {

                        // Crear página A4
                        PDPage pagina = new PDPage(PDRectangle.A4);
                        documento.addPage(pagina);

                        // Configurar contenido
                        try (PDPageContentStream contenido = new PDPageContentStream(documento, pagina)) {

                                // Configurar fuente
                                PDType1Font fuenteTitulo = PDType1Font.HELVETICA_BOLD;
                                PDType1Font fuenteNormal = PDType1Font.HELVETICA;

                                float margenIzquierdo = 50;
                                float anchoLinea = 500;
                                float yPosicion = 750; // Empezar desde arriba

                                // ===== ENCABEZADO =====
                                contenido.setFont(fuenteTitulo, 20);
                                contenido.beginText();
                                contenido.newLineAtOffset(margenIzquierdo, yPosicion);
                                contenido.showText("COMPROBANTE DE RESERVA");
                                contenido.endText();

                                // Línea separadora
                                yPosicion -= 30;
                                dibujarLinea(contenido, margenIzquierdo, yPosicion, anchoLinea);

                                // ===== DATOS DEL COMPROBANTE =====
                                yPosicion -= 30;
                                contenido.setFont(fuenteTitulo, 14);
                                escribirTexto(contenido, "INFORMACIÓN DEL COMPROBANTE", margenIzquierdo, yPosicion,
                                                fuenteTitulo, 14);

                                yPosicion -= 25;
                                contenido.setFont(fuenteNormal, 12);
                                escribirTexto(contenido, "Código Comprobante: " + comprobante.getCodigoComprobante(),
                                                margenIzquierdo, yPosicion,
                                                fuenteNormal, 12);

                                Reserva reserva = comprobante.getReserva();

                                yPosicion -= 15;
                                escribirTexto(contenido, "Código Reserva: " + reserva.getCodUnico(), margenIzquierdo,
                                                yPosicion,
                                                fuenteNormal, 12);

                                yPosicion -= 15;
                                String fechaEmision = comprobante.getFechaEmision()
                                                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
                                escribirTexto(contenido, "Fecha de Emisión: " + fechaEmision, margenIzquierdo,
                                                yPosicion, fuenteNormal,
                                                12);

                                // ===== DATOS DEL USUARIO =====
                                yPosicion -= 40;
                                escribirTexto(contenido, "DATOS DEL CLIENTE", margenIzquierdo, yPosicion, fuenteTitulo,
                                                14);

                                Usuario usuario = reserva.getUsuario();

                                yPosicion -= 25;
                                escribirTexto(contenido,
                                                "Cliente: " + usuario.getNombre() + " " + usuario.getApellido(),
                                                margenIzquierdo, yPosicion, fuenteNormal, 12);

                                yPosicion -= 15;
                                escribirTexto(contenido, "Email: " + usuario.getEmail(), margenIzquierdo, yPosicion,
                                                fuenteNormal, 12);

                                yPosicion -= 15;
                                escribirTexto(contenido,
                                                "Teléfono: " + (usuario.getTelefono() != null ? usuario.getTelefono()
                                                                : "No especificado"),
                                                margenIzquierdo, yPosicion, fuenteNormal, 12);

                                // ===== DATOS DE LA RESERVA =====
                                yPosicion -= 40;
                                escribirTexto(contenido, "DETALLES DE LA RESERVA", margenIzquierdo, yPosicion,
                                                fuenteTitulo, 14);

                                CanchaDeportiva cancha = reserva.getCanchaDeportiva();

                                yPosicion -= 25;
                                escribirTexto(contenido,
                                                "Cancha: " + cancha.getTipoCancha() + " - " + cancha.getNumeroCancha(),
                                                margenIzquierdo, yPosicion, fuenteNormal, 12);

                                yPosicion -= 15;
                                String fechaReserva = reserva.getFechaInicio()
                                                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
                                escribirTexto(contenido, "Fecha de la Reserva: " + fechaReserva, margenIzquierdo,
                                                yPosicion,
                                                fuenteNormal, 12);

                                yPosicion -= 15;
                                String horaInicio = reserva.getFechaInicio()
                                                .format(DateTimeFormatter.ofPattern("HH:mm"));
                                String horaFin = reserva.getFechaFin().format(DateTimeFormatter.ofPattern("HH:mm"));
                                escribirTexto(contenido, "Horario: " + horaInicio + " - " + horaFin, margenIzquierdo,
                                                yPosicion,
                                                fuenteNormal, 12);

                                yPosicion -= 15;
                                escribirTexto(contenido, "Duración: " + reserva.getHorasTotales() + " hora(s)",
                                                margenIzquierdo,
                                                yPosicion, fuenteNormal, 12);

                                yPosicion -= 15;
                                escribirTexto(contenido, "Capacidad: " + cancha.getCapacidadJugadores() + " jugadores",
                                                margenIzquierdo,
                                                yPosicion, fuenteNormal, 12);

                                yPosicion -= 15;
                                escribirTexto(contenido, "Tipo de Grass: " + cancha.getTipoGrass(), margenIzquierdo,
                                                yPosicion,
                                                fuenteNormal, 12);

                                if (cancha.getDescripcion() != null && !cancha.getDescripcion().isEmpty()) {
                                        yPosicion -= 15;
                                        escribirTexto(contenido, "Descripción: " + cancha.getDescripcion(),
                                                        margenIzquierdo, yPosicion,
                                                        fuenteNormal, 12);
                                }

                                // ===== DETALLES FINANCIEROS =====
                                yPosicion -= 50;
                                dibujarLinea(contenido, margenIzquierdo, yPosicion, anchoLinea);

                                yPosicion -= 30;
                                escribirTexto(contenido, "DETALLE DE COSTOS", margenIzquierdo, yPosicion, fuenteTitulo,
                                                14);

                                yPosicion -= 30;
                                String precioHora = String.format("S/ %.2f", cancha.getPrecioPorHora());
                                escribirTexto(contenido, "Precio por hora:", margenIzquierdo, yPosicion, fuenteNormal,
                                                12);
                                escribirTexto(contenido, precioHora, margenIzquierdo + 300, yPosicion, fuenteNormal,
                                                12);

                                yPosicion -= 15;
                                escribirTexto(contenido, "Horas reservadas:", margenIzquierdo, yPosicion, fuenteNormal,
                                                12);
                                escribirTexto(contenido, String.valueOf(reserva.getHorasTotales()),
                                                margenIzquierdo + 300, yPosicion,
                                                fuenteNormal, 12);

                                yPosicion -= 15;
                                String subtotalTexto = String.format("S/ %.2f", comprobante.getSubtotal());
                                escribirTexto(contenido, "Subtotal:", margenIzquierdo, yPosicion, fuenteNormal, 12);
                                escribirTexto(contenido, subtotalTexto, margenIzquierdo + 300, yPosicion, fuenteNormal,
                                                12);

                                yPosicion -= 15;
                                String igvTexto = String.format("S/ %.2f", comprobante.getIgv());
                                escribirTexto(contenido, "IGV (18%):", margenIzquierdo, yPosicion, fuenteNormal, 12);
                                escribirTexto(contenido, igvTexto, margenIzquierdo + 300, yPosicion, fuenteNormal, 12);

                                // Total con línea superior
                                yPosicion -= 15;
                                dibujarLinea(contenido, margenIzquierdo + 200, yPosicion, 250);

                                yPosicion -= 25;
                                String totalTexto = String.format("S/ %.2f", comprobante.getTotal());
                                escribirTexto(contenido, "TOTAL:", margenIzquierdo, yPosicion, fuenteTitulo, 14);
                                escribirTexto(contenido, totalTexto, margenIzquierdo + 300, yPosicion, fuenteTitulo,
                                                14);

                                // ===== PIE DE PÁGINA =====
                                yPosicion -= 60;
                                dibujarLinea(contenido, margenIzquierdo, yPosicion, anchoLinea);

                                yPosicion -= 25;
                                escribirTexto(contenido, "IMPORTANTE:", margenIzquierdo, yPosicion, fuenteTitulo, 12);

                                yPosicion -= 20;
                                escribirTexto(contenido, "• Presente este comprobante al momento de su llegada",
                                                margenIzquierdo,
                                                yPosicion, fuenteNormal, 10);

                                yPosicion -= 15;
                                escribirTexto(contenido, "• Llegue 15 minutos antes de su horario reservado",
                                                margenIzquierdo,
                                                yPosicion, fuenteNormal, 10);

                                yPosicion -= 15;
                                escribirTexto(contenido, "• Para cancelaciones contactar con 48 horas de anticipación",
                                                margenIzquierdo,
                                                yPosicion, fuenteNormal, 10);

                                yPosicion -= 30;
                                String fechaGeneracion = LocalDateTime.now()
                                                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"));
                                escribirTexto(contenido, "Documento generado el " + fechaGeneracion, margenIzquierdo,
                                                yPosicion,
                                                fuenteNormal, 9);
                        }

                        // Convertir documento a byte array
                        ByteArrayOutputStream baos = new ByteArrayOutputStream();
                        documento.save(baos);
                        return baos.toByteArray();

                } catch (Exception e) {
                        logger.error("Error generando PDF del comprobante ID: " + comprobante.getId(), e);
                        throw new RuntimeException("Error al generar PDF del comprobante", e);
                }
        }

        private void escribirTexto(PDPageContentStream contenido, String texto, float x, float y,
                        PDFont fuente, float tamaño) throws IOException {
                contenido.setFont(fuente, tamaño);
                contenido.beginText();
                contenido.newLineAtOffset(x, y);
                contenido.showText(texto);
                contenido.endText();
        }

        private void dibujarLinea(PDPageContentStream contenido, float xInicio, float y, float ancho)
                        throws IOException {
                contenido.moveTo(xInicio, y);
                contenido.lineTo(xInicio + ancho, y);
                contenido.stroke();
        }

}
