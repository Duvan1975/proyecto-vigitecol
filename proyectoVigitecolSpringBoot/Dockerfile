FROM eclipse-temurin:17-jdk

WORKDIR /app

COPY . .

RUN chmod +x mvnw

RUN ./mvnw clean package -DskipTests

CMD ["java", "-jar", "target/proyectoVigitecolSpringBoot-0.0.1-SNAPSHOT.jar", "--spring.profiles.active=prod"]
