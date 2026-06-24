FROM eclipse-temurin:25-jdk-alpine
WORKDIR /app
COPY . .
RUN chmod +x gradlew
RUN ./gradlew build -x test
EXPOSE 8080
CMD ["java", "-jar", "build/libs/server-0.0.1-SNAPSHOT.jar"]
