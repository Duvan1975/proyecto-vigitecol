# Imagen base con JDK 17
FROM eclipse-temurin:17-jdk as build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos los archivos del proyecto
COPY . .

# Compilamos la aplicación
RUN ./mvnw clean package -DskipTests

# Segunda etapa: Imagen final más ligera
FROM eclipse-temurin:17-jdk

# Directorio de trabajo
WORKDIR /app

# Copiamos el jar generado desde la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto
EXPOSE 8080

# Comando para arrancar la app CON perfil prod
ENTRYPOINT ["java", "-jar", "app.jar", "--spring.profiles.active=prod"]