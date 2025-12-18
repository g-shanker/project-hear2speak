# 1. Build Stage
FROM maven:3.9.6-eclipse-temurin-21 AS build

# FIX: We are in the Root, so we copy 'backend/src'
COPY backend/src /usr/src/app/src
COPY backend/pom.xml /usr/src/app

WORKDIR /usr/src/app
RUN mvn clean package -DskipTests

# 2. Run Stage
FROM eclipse-temurin:21-jre
WORKDIR /work/
COPY --from=build /usr/src/app/target/quarkus-app/lib/ /work/lib/
COPY --from=build /usr/src/app/target/quarkus-app/*.jar /work/
COPY --from=build /usr/src/app/target/quarkus-app/app/ /work/app/
COPY --from=build /usr/src/app/target/quarkus-app/quarkus/ /work/quarkus/

EXPOSE 8080
CMD ["java", "-jar", "quarkus-run.jar"]