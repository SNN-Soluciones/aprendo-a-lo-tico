package cr.aprendoalotico.api.comun.web;

import java.io.IOException;

/** Lo que se mandó pasó el tope mientras se leía (llegó por partes, sin decir su tamaño): sale como 413. */
public class CuerpoDemasiadoGrande extends IOException {

    public CuerpoDemasiadoGrande() {
        super("El cuerpo del pedido pasó el tope", null);
    }
}
