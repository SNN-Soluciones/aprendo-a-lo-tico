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

## ✅ Fase 0.5 · Una materia de cada una (hecho)

- [x] Juego: Sumas con bloques (llevando con el imán 🧲)
- [x] Juego: Animales de Costa Rica (dónde vive, qué come)
- [x] Juego: Mapa de provincias (explorar, dónde queda, cabeceras)
- [x] Juego: Listen and tap (colores, animales, números, familia, frutas; con voz)

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
- [x] Sumas llevando con bloques (espejo de las restas)
- [ ] 🚌 ¿A qué hora llega el bus? Tiempo transcurrido ("sale de Cartago a las 7:15 y llega a las 8:40") · 3°–4°
- [ ] Pulpería: ¿cuánta plata hay? (contar un montón)
- [ ] Pulpería: alcancía (¿qué puedo comprar sin pasarme?)
- [ ] Cambiar billetes (¿cuántas de ₡500 hacen ₡5 000?)
- [ ] ✖️ Tablas en la feria: multiplicación como filas de mangos en el tramo, con modo contra reloj · 2°–4°
- [ ] 🥭 Repartiendo mangos: división arrastrando a canastas, el sobrante es el residuo · 3°–4°
- [ ] 🍕 Fracciones con pizza y sandía: cortar, pintar la fracción y comparar · 3°–5°
- [ ] Decimales con plata
- [ ] 🏷️ Descuentos en la pulpería: porcentajes y decimales con precios en colones · 5°–6°

## ✏️ Español

- [ ] Lectura de oraciones cortas con audio
- [ ] 🔤 Armo la oración: ordenar palabras, mayúscula y punto · 1°–2°
- [ ] Mayúsculas y puntuación
- [ ] 🐝 Ortografía: b/v, s/c/z, h (completar la palabra + pista de la regla) · 3°–6°
- [ ] 🦥 ¿Qué es? Sustantivo, verbo, adjetivo: clasificar en tres canastas · 3°–5°
- [ ] 📖 Cuentos ticos cortos: comprensión lectora con cuentos originales (preguntas literales e inferenciales) · 2°–6°

## 🌱 Ciencias

- [x] Animales de Costa Rica (hábitat, qué comen)
- [ ] Animales: más animales (manatí, danta, pizote, tucán) con ilustraciones propias en vez de emoji
- [ ] 🌱 Partes de la planta: arrastrar etiquetas (raíz, tallo, hoja, flor, fruto) · 1°–3°
- [ ] 🌳 Ecosistemas ticos: bosque nuboso, manglar, arrecife, páramo, bosque seco · 4°–6°
- [ ] Cuerpo humano básico

## 🗺️ Estudios Sociales

- [x] Provincias y cabeceras en mapa interactivo
- [ ] Mapa: cantones por provincia (5°–6°), volcanes, ríos y parques nacionales
- [ ] 🇨🇷 Símbolos patrios: memoria (guaria morada, yigüirro, guanacaste, carreta, antorcha…) · 1°–3°
- [ ] 📅 Efemérides: parejas fecha–evento (15 de setiembre, 25 de julio, 1° de diciembre, 12 de octubre…) · 2°–6°
- [ ] Mi comunidad: servicios, oficios

## 💬 Inglés

- [x] Vocabulario con imagen y audio (colores, animales, números, familia)
- [x] Listen and tap
- [ ] Listen and tap: más temas (ropa, cuerpo, escuela, comida) y números hasta 100
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
- [ ] Extraer la voz (`speechSynthesis`) a un `js/voz.js` compartido (ya la usan animales, provincias y listen-tap)
- [ ] Componentes reutilizables: teclado numérico, retroalimentación, estrellas
- [ ] Tests de los generadores de problemas (que siempre sean válidos)
- [ ] APK con Capacitor + ícono y splash
- [ ] Publicar en Google Play (cuenta de desarrollador, ficha de "apps para niños" / Families Policy)
- [ ] Accesibilidad: contraste, tamaños táctiles, lector de pantalla
- [ ] Evaluar migrar a Angular cuando haya perfiles y backend
