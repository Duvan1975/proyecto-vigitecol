# Usar imagen más ligera
FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiar solo los archivos necesarios para cache de Maven
COPY pom.xml .
COPY src ./src

# Instalar Maven en Alpine
RUN apk add --no-cache maven

# Compilar con más memoria
RUN mvn clean package -DskipTests -Xmx512m

# Crear imagen final mínima
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=0 /app/target/proyectoVigitecolSpringBoot-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]