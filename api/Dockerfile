# Imagen del API: se compila en una etapa y se corre en otra, solo con el JRE y sin privilegios.
# La salud la revisa App Platform con /actuator/health/liveness (no hace falta HEALTHCHECK aquí).
FROM eclipse-temurin:24-jdk AS compilar
WORKDIR /fuente
COPY gradlew settings.gradle build.gradle ./
COPY gradle gradle
# Las dependencias en su propia capa: si solo cambia el código, no se vuelven a bajar
RUN ./gradlew --no-daemon dependencies > /dev/null
COPY src src
RUN ./gradlew --no-daemon bootJar -x test

FROM eclipse-temurin:24-jre
RUN useradd --system --uid 10001 --no-create-home aprendo
WORKDIR /app
COPY --from=compilar /fuente/build/libs/app.jar app.jar
USER 10001
EXPOSE 8080
ENV SPRING_PROFILES_ACTIVE=prod
# 70 % de la memoria para el heap: el resto queda para metaspace, hilos y memoria nativa (instancias de 1 GB o más)
ENTRYPOINT ["java", "-XX:MaxRAMPercentage=70", "-XX:+ExitOnOutOfMemoryError", "-jar", "/app/app.jar"]
