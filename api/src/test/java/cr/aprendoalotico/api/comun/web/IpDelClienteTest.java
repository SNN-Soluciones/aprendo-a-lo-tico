package cr.aprendoalotico.api.comun.web;

import static org.assertj.core.api.Assertions.assertThat;

import cr.aprendoalotico.api.comun.PropiedadesApp;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.mock.web.MockHttpServletRequest;

class IpDelClienteTest {

    private static final String CABECERA = "do-connecting-ip";

    private static IpDelCliente detras(String cabecera) {
        return new IpDelCliente(new PropiedadesApp("https://aprendoalotico.cr", null, cabecera));
    }

    private static MockHttpServletRequest pedido(String conexion, String cabecera) {
        var p = new MockHttpServletRequest();
        p.setRemoteAddr(conexion);
        if (cabecera != null) {
            p.addHeader(CABECERA, cabecera);
        }
        return p;
    }

    @Test
    @DisplayName("Sin cabecera configurada (en la compu) vale la IP de la conexión, aunque el cliente mande do-connecting-ip")
    void sinProxy() {
        assertThat(detras(null).de(pedido("192.168.0.5", "1.2.3.4"))).isEqualTo("192.168.0.5");
    }

    @Test
    @DisplayName("Detrás de App Platform vale la de la cabecera")
    void conProxy() {
        assertThat(detras(CABECERA).de(pedido("10.244.0.9", " 200.91.4.17 "))).isEqualTo("200.91.4.17");
        assertThat(detras(CABECERA).de(pedido("10.244.0.9", "2001:db8::1"))).isEqualTo("2001:db8:0:0:0:0:0:1");
    }

    @ParameterizedTest(name = "«{0}»")
    @ValueSource(strings = { "", "evil.example", "localhost", "1.2.3.4, 5.6.7.8", "999.1.1.1", "1.2.3", "fe80::1%eth0", "::zz", "[::1]", ".:", "1.2.3.4:80",
        "abc:" })
    @DisplayName("Si la cabecera no es una IP literal se ignora (y nunca se busca en el DNS): vale la de la conexión")
    void cabeceraInvalida(String valor) {
        assertThat(detras(CABECERA).de(pedido("10.244.0.9", valor))).isEqualTo("10.244.0.9");
    }

    @Test
    @DisplayName("Sin la cabecera, o sin nada válido, se arregla con lo que haya")
    void sinNada() {
        assertThat(detras(CABECERA).de(pedido("10.244.0.9", null))).isEqualTo("10.244.0.9");
        assertThat(detras(null).de(pedido("no-es-ip", null))).isEqualTo("desconocida");
    }

    @Test
    @DisplayName("Para los límites, una IPv6 cuenta por su red /64 (quien tiene una, tiene millones); una IPv4, tal cual")
    void paraLimites() {
        var ip = detras(CABECERA);
        assertThat(ip.paraLimites(pedido("10.0.0.1", "2001:db8:aa:bb:1:2:3:4"))).isEqualTo("2001:db8:aa:bb::/64");
        assertThat(ip.paraLimites(pedido("10.0.0.1", "2001:db8:aa:bb:ffff::9"))).isEqualTo("2001:db8:aa:bb::/64");
        assertThat(ip.paraLimites(pedido("10.0.0.1", "200.91.4.17"))).isEqualTo("200.91.4.17");
        assertThat(ip.paraLimites(pedido("10.0.0.1", "::ffff:200.91.4.17"))).as("IPv4 escrita como IPv6").isEqualTo("200.91.4.17");
    }
}
