FROM eclipse-temurin:21-jdk-jammy

WORKDIR /app

COPY target/api-0.0.1-SNAPSHOT.jar api-0.0.1-SNAPSHOT.jar

EXPOSE 8080

ENTRYPOINT ["java","-jar","api-0.0.1-SNAPSHOT.jar"]