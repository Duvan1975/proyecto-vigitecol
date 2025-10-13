FROM eclipse-temurin:17-jdk-alpine

WORKDIR /app

# Copiar desde la ubicación actual (todo está aquí)
COPY . .

# Instalar Maven
RUN apk add --no-cache maven

# Compilar
RUN mvn clean package -DskipTests

# Imagen final
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app
COPY --from=0 /app/target/proyectoVigitecolSpringBoot-0.0.1-SNAPSHOT.jar app.jar

# Limitar memoria para Railway
ENV JAVA_OPTS="-Xmx256m -Xms128m"

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]