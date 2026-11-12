package cr.aprendoalotico.api.instituciones;

import cr.aprendoalotico.api.instituciones.api.Rol;
import java.time.OffsetDateTime;
import java.util.UUID;

/** Una invitación sin usar, para mostrarla sin su código (que no se guarda). */
public record InvitacionPendiente(UUID id, Rol rol, String creadaPor, OffsetDateTime creadaEn, OffsetDateTime expiraEn) {
}
