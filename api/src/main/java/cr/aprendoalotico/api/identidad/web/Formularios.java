package cr.aprendoalotico.api.identidad.web;

import cr.aprendoalotico.api.identidad.Claves;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

/** Lo que mandan las pantallas de identidad, con sus reglas (los errores vuelven en error.campos). */
final class Formularios {

    private Formularios() {
    }

    /**
     * Un correo común y corriente, solo ASCII: usuario con letras, números y . _ % + - (sin puntos seguidos ni en las
     * puntas), y un dominio con al menos un punto. Nada de comillas, comas, «<», bytes nulos ni letras con tilde: lo
     * que pasa de aquí lo acepta cualquier SMTP y la base.
     */
    static final String CORREO = "[A-Za-z0-9_%+-]+(\\.[A-Za-z0-9_%+-]+)*@[A-Za-z0-9](-*[A-Za-z0-9])*(\\.[A-Za-z0-9](-*[A-Za-z0-9])*)*\\.[A-Za-z]{2,}";
    static final String MENSAJE_CORREO = "Ese correo no es válido";
    static final String MENSAJE_CLAVE = "La clave tiene que tener entre " + Claves.MINIMO + " y " + Claves.MAXIMO + " caracteres";
    /** Solo letras (de cualquier idioma), espacios, puntos, apóstrofos y guiones: un nombre, no un enlace ni un mensaje. */
    static final String NOMBRE = "[\\p{L}\\p{M}][\\p{L}\\p{M} .'’-]*";

    /** Espacios de más fuera; null queda null (lo marca @NotBlank). */
    static String limpio(String texto) {
        return texto == null ? null : texto.strip().replaceAll("\\s+", " ");
    }

    /** Crear la cuenta con el enlace del correo: aquí se escriben el nombre y la clave (B18). */
    record Confirmacion(
            @NotBlank(message = "Falta el enlace") @Size(max = 100, message = "Ese enlace no es válido") String token,
            @NotBlank(message = "Escribí tu nombre") @Size(max = 80, message = "El nombre puede tener hasta 80 letras")
            @Pattern(regexp = NOMBRE, message = "Escribí solo tu nombre, con letras") String nombre,
            @NotNull(message = MENSAJE_CLAVE) @Size(min = Claves.MINIMO, max = Claves.MAXIMO, message = MENSAJE_CLAVE) String clave) {

        Confirmacion {
            nombre = limpio(nombre);
        }

        @Override
        public String toString() {
            return "Confirmacion[]";
        }
    }

    record Entrada(
            @NotBlank(message = MENSAJE_CORREO) @Size(max = 254, message = MENSAJE_CORREO) @Email(regexp = CORREO, message = MENSAJE_CORREO) String correo,
            @NotNull(message = "Escribí tu clave") @Size(max = Claves.MAXIMO, message = MENSAJE_CLAVE) String clave) {

        Entrada {
            correo = limpio(correo);
        }

        @Override
        public String toString() {
            return "Entrada[]";
        }
    }

    record Correo(@NotBlank(message = MENSAJE_CORREO) @Size(max = 254, message = MENSAJE_CORREO) @Email(regexp = CORREO, message = MENSAJE_CORREO) String correo) {

        Correo {
            correo = limpio(correo);
        }

        @Override
        public String toString() {
            return "Correo[]";
        }
    }

    record ClaveNueva(
            @NotBlank(message = "Falta el enlace") @Size(max = 100, message = "Ese enlace no es válido") String token,
            @NotNull(message = MENSAJE_CLAVE) @Size(min = Claves.MINIMO, max = Claves.MAXIMO, message = MENSAJE_CLAVE) String clave) {

        @Override
        public String toString() {
            return "ClaveNueva[]";
        }
    }

    record CambioDeClave(
            @NotNull(message = "Escribí tu clave actual") @Size(max = Claves.MAXIMO, message = MENSAJE_CLAVE) String actual,
            @NotNull(message = MENSAJE_CLAVE) @Size(min = Claves.MINIMO, max = Claves.MAXIMO, message = MENSAJE_CLAVE) String nueva) {

        @Override
        public String toString() {
            return "CambioDeClave[]";
        }
    }
}
