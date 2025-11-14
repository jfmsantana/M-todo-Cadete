# backend/Dockerfile

# FASE 1: build do jar
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn -q -DskipTests package

# FASE 2: imagem enxuta só com o jar
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# copia o jar gerado (ajuste o nome se quiser algo fixo)
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
