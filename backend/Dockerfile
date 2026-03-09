# ====== Stage 1: Build ======
FROM eclipse-temurin:17-jdk AS build

WORKDIR /app

# Copy Maven wrapper và pom.xml trước (tận dụng Docker cache)
COPY pom.xml .
COPY .mvn .mvn
COPY mvnw .
RUN chmod +x mvnw

# Download dependencies (cache layer)
RUN ./mvnw dependency:go-offline -B

# Copy source code và build
COPY src ./src
RUN ./mvnw package -DskipTests -B

# ====== Stage 2: Runtime ======
FROM eclipse-temurin:17-jre

WORKDIR /app

# Copy JAR file từ stage build
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
