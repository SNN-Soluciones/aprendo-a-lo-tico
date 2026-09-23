# TODO · Aprendo a lo Tico

Hoja de ruta. Marcá con `[x]` lo que se vaya haciendo.

## ✅ Fase 0 · Arranque (hecho)

- [x] Sitio estático listo para App Platform
- [x] Inicio con filtros por materia y grado
- [x] Juego: Aprendo la hora (a lo tico, modo adivinar)
- [x] Juego: Restas con bloques (préstamo visual)
- [x] Juego: La pulpería (billetera, pagar, vuelto)
- [x] Página de apoyo con SINPE Móvil
- [x] PWA: instalable y offline

## 🚀 Fase 1 · Publicar bien

- [ ] Poner el número real de SINPE en `js/config.js`
- [ ] Definir si las donaciones entran a cuenta personal, de SNN Soluciones o una cuenta aparte (consultarlo con un contador por el tema de Hacienda)
- [ ] Comprar dominio (`aprendoalotico.com` / `.cr`) y conectarlo en App Platform
- [ ] Logo e identidad visual (ícono definitivo, ilustraciones)
- [ ] Fuente Baloo 2 local en `public/fonts/` (offline total y APK)
- [ ] Página "Acerca de" + política de privacidad corta (no recolectamos datos)
- [ ] Definir licencia: código (MIT) y contenido (CC BY-NC-SA)
- [ ] Imagen para compartir en WhatsApp/Facebook (`og:image`)
- [ ] Analítica sin cookies ni datos personales (o ninguna)

## 🧒 Fase 2 · Para los más chiquitos (Prepa, 4–5 años)

- [ ] **Voz en todo:** instrucciones leídas con Web Speech API (`speechSynthesis`, voz `es-*`)
- [ ] **Trazos de letras:** canvas + pointer events, letra punteada, flechas de orden del trazo, validación por tolerancia
- [ ] Trazar su nombre (lo escribe el papá)
- [ ] Palabras comunes: mamá, papá, casa, sol, perro…
- [ ] Método silábico: ma me mi mo mu, pa pe pi po pu…
- [ ] Armar palabras con sílabas (arrastrar)
- [ ] Contar objetos del 1 al 20
- [ ] Colores y figuras

## 🔢 Matemáticas por grado

- [ ] Sacar los rangos de cada juego a una config por grado (`generate(nivel)`)
- [ ] Sumas llevando con bloques (espejo de las restas)
- [ ] Reloj: tiempo transcurrido ("entré a las 7:15, salí a las 12:40")
- [ ] Pulpería: ¿cuánta plata hay? (contar un montón)
- [ ] Pulpería: alcancía (¿qué puedo comprar sin pasarme?)
- [ ] Cambiar billetes (¿cuántas de ₡500 hacen ₡5 000?)
- [ ] Tablas de multiplicar jugando
- [ ] División repartiendo (galletas, mangos)
- [ ] Fracciones con pizza / sandía
- [ ] Decimales con plata
- [ ] Porcentajes: descuentos en la pulpería (6°)

## ✏️ Español

- [ ] Lectura de oraciones cortas con audio
- [ ] Mayúsculas y puntuación
- [ ] Sustantivo, verbo, adjetivo (clasificar)
- [ ] Comprensión lectora con cuentos cortos originales

## 🌱 Ciencias

- [ ] Animales de Costa Rica (hábitat, qué comen)
- [ ] Partes de la planta
- [ ] Ecosistemas: bosque nuboso, manglar, arrecife, páramo
- [ ] Cuerpo humano básico

## 🗺️ Estudios Sociales

- [ ] Provincias y cabeceras en mapa interactivo
- [ ] Símbolos patrios
- [ ] Efemérides (15 de setiembre, 25 de julio, 12 de octubre…)
- [ ] Mi comunidad: servicios, oficios

## 💬 Inglés

- [ ] Vocabulario con imagen y audio (colores, animales, números, familia)
- [ ] Listen and tap
- [ ] Frases simples

## 👨‍👩‍👧 Perfiles y progreso (local)

- [ ] Perfiles por niño (nombre + avatar) en `localStorage`
- [ ] Estrellas y logros por perfil
- [ ] Modo papá con PIN: ver progreso, cambiar grado, reiniciar
- [ ] Superhéroes ticos **originales** como mascotas/avatares (no personajes con derechos de autor)

## 🏫 Fase 3 · Maestros y papás (con backend)

- [ ] Backend Spring Boot en DO + base de datos
- [ ] Roles: estudiante / papá / maestro
- [ ] Maestro crea grupo con código de clase
- [ ] Niños entran con avatar + clave de dibujitos (sin correo)
- [ ] Maestro asigna tareas y ve avance del grupo
- [ ] Consentimiento de papás; cumplir Ley 8968 (protección de datos) y revisar lineamientos de PRODHAB
- [ ] Contenido como JSON editable + editor para maestros

## 🛠️ Técnico

- [ ] Extraer estilos comunes de los juegos a `css/juego.css`
- [ ] Componentes reutilizables: teclado numérico, retroalimentación, estrellas
- [ ] Tests de los generadores de problemas (que siempre sean válidos)
- [ ] APK con Capacitor + ícono y splash
- [ ] Publicar en Google Play (cuenta de desarrollador, ficha de "apps para niños" / Families Policy)
- [ ] Accesibilidad: contraste, tamaños táctiles, lector de pantalla
- [ ] Evaluar migrar a Angular cuando haya perfiles y backend
