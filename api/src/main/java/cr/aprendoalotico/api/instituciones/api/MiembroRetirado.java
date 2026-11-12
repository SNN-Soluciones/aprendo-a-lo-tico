package cr.aprendoalotico.api.instituciones.api;

import java.util.UUID;

/**
 * Alguien dejó de ser miembro de una institución (lo sacaron o se salió). Se publica dentro de la misma transacción:
 * quien lo escuche (grupos) saca a esa persona de lo suyo en esa institución, o no se saca nada.
 */
public record MiembroRetirado(UUID usuario, UUID institucion) {
}
