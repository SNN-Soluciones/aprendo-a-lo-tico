package cr.aprendoalotico.api.comun.seguridad;

import cr.aprendoalotico.api.comun.web.CuerpoDemasiadoGrande;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletRequestWrapper;
import jakarta.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpStatus;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Un tope al tamaño de lo que se manda (DISENO.md, sección 4): nadie tiene por qué mandar más que un formulario, y
 * sin tope un pedido de varios megas ocupa memoria y CPU antes de llegar a la validación. Si el pedido dice su tamaño
 * y se pasa, se rechaza sin leerlo; si llega por partes, se corta al pasarse (ManejadorErrores lo convierte en 413).
 * Corre antes que cualquier otro filtro que lea el cuerpo (ConfiguracionSeguridad#limiteDeCuerpo).
 */
public class LimiteDeCuerpoFiltro extends OncePerRequestFilter {

    /** 64 KB: más que de sobra para cualquier JSON del API (una lista de 40 estudiantes pesa menos de 4 KB). */
    public static final long MAXIMO = 64 * 1024;

    private final long maximo;

    public LimiteDeCuerpoFiltro(long maximo) {
        this.maximo = maximo;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest pedido, HttpServletResponse respuesta, FilterChain cadena)
            throws ServletException, IOException {
        long largo = pedido.getContentLengthLong();
        if (largo > maximo) {
            // Corre antes que Spring Security: las cabeceras de seguridad las pone él mismo
            CabecerasDeSeguridad.ponerSiFaltan(respuesta);
            EscritorDeErrores.escribir(respuesta, HttpStatus.CONTENT_TOO_LARGE, "DEMASIADO_GRANDE", "Lo que se mandó es demasiado grande.");
            return;
        }
        cadena.doFilter(largo < 0 ? new PedidoConTope(pedido, maximo) : pedido, respuesta);
    }

    /** Un pedido cuyo cuerpo deja de leerse al pasar el tope. */
    private static final class PedidoConTope extends HttpServletRequestWrapper {

        private final long maximo;
        private ServletInputStream cuerpo;

        PedidoConTope(HttpServletRequest pedido, long maximo) {
            super(pedido);
            this.maximo = maximo;
        }

        @Override
        public ServletInputStream getInputStream() throws IOException {
            if (cuerpo == null) {
                cuerpo = new CuerpoContado(super.getInputStream(), maximo);
            }
            return cuerpo;
        }

        @Override
        public BufferedReader getReader() throws IOException {
            String nombre = getCharacterEncoding();
            Charset juego = nombre == null ? StandardCharsets.UTF_8 : Charset.forName(nombre);
            return new BufferedReader(new InputStreamReader(getInputStream(), juego));
        }
    }

    /** Cuenta lo leído y corta al pasarse. */
    private static final class CuerpoContado extends ServletInputStream {

        private final ServletInputStream original;
        private final long maximo;
        private long leidos;

        CuerpoContado(ServletInputStream original, long maximo) {
            this.original = original;
            this.maximo = maximo;
        }

        @Override
        public int read() throws IOException {
            int b = original.read();
            if (b >= 0) {
                contar(1);
            }
            return b;
        }

        @Override
        public int read(byte[] destino, int desde, int cuantos) throws IOException {
            int n = original.read(destino, desde, cuantos);
            if (n > 0) {
                contar(n);
            }
            return n;
        }

        private void contar(int n) throws CuerpoDemasiadoGrande {
            leidos += n;
            if (leidos > maximo) {
                throw new CuerpoDemasiadoGrande();
            }
        }

        @Override
        public boolean isFinished() {
            return original.isFinished();
        }

        @Override
        public boolean isReady() {
            return original.isReady();
        }

        @Override
        public void setReadListener(ReadListener oyente) {
            original.setReadListener(oyente);
        }
    }
}
