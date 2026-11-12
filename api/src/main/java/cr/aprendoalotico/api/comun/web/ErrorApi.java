package cr.aprendoalotico.api.comun.web;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Qué salió mal, dicho para quien lo va a leer.
 *
 * @param codigo  estable, en MAYUSCULAS_CON_GUIONES: el portal decide qué hacer con esto (nunca con el mensaje)
 * @param mensaje para mostrarle a la persona, en español; nunca trae detalles internos
 * @param campos  en errores de validación, cada campo con su problema, en el orden del formulario (null si no aplica)
 * @param pedido  id del pedido, para encontrarlo en los logs cuando alguien reporta el error
 */
public record ErrorApi(String codigo, String mensaje, Map<String, String> campos, String pedido) {

    public ErrorApi {
        campos = campos == null ? null : Collections.unmodifiableMap(new LinkedHashMap<>(campos));
    }
}
