package cr.aprendoalotico.api.instituciones.api;

import java.util.Optional;
import java.util.UUID;

/** Para que los demás módulos decidan qué deja ver o hacer cada institución (B10, B23). */
public interface Accesos {

    /** Lo que puede esa persona en esa institución; vacío si no es miembro (o la institución no existe). */
    Optional<Acceso> de(UUID usuario, UUID institucion);

    /**
     * Lo mismo, trabando la institución (compartido) hasta el fin de la transacción en curso: mientras tanto nadie saca
     * a nadie de ahí. Para quien agrega a alguien a algo suyo (un grupo): sin esto, podría quedar ahí alguien que acaban
     * de sacar de la institución.
     */
    Optional<Acceso> deTrabando(UUID usuario, UUID institucion);
}
