package cr.aprendoalotico.api.comun.correo;

/** Manda un correo ya, sin reintentar. Lo usa Correos; en las pruebas se cambia por un buzón en memoria. */
public interface Cartero {

    void enviar(Mensaje mensaje);
}
