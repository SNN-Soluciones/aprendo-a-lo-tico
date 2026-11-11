package cr.aprendoalotico.api.auditoria.api;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

/**
 * Una fila de la auditoría.
 *
 * @param tipo          quién: USUARIO, ESTUDIANTE o SISTEMA
 * @param actor         su id (null si es el sistema)
 * @param accion        qué hizo, en MAYUSCULAS: VER, CREAR, CAMBIAR, RETIRAR, VER_DENEGADO…
 * @param recurso       sobre qué: ESTUDIANTE, GRUPO, SESION…
 * @param recursoId     cuál (null si no aplica)
 * @param institucionId de qué escuela u hogar (null si no aplica): sirve para darle a una escuela su propia auditoría
 * @param detalle       datos extra útiles, con ids y no con datos personales: la auditoría no se borra
 */
public record EventoAuditoria(TipoDeActor tipo, UUID actor, String accion, String recurso, UUID recursoId, UUID institucionId,
        Map<String, Object> detalle) {

    public EventoAuditoria {
        if (tipo == null) {
            throw new IllegalArgumentException("Falta quién hizo la acción");
        }
        if (accion == null || accion.isBlank() || recurso == null || recurso.isBlank()) {
            throw new IllegalArgumentException("Un evento de auditoría necesita acción y recurso");
        }
        detalle = detalle == null ? Map.of() : Collections.unmodifiableMap(new LinkedHashMap<>(detalle));
    }
}
