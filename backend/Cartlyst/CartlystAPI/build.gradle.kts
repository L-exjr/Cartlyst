plugins {
	java
	id("org.springframework.boot") version "3.4.6"
	id("io.spring.dependency-management") version "1.1.4"
}

group = "com.Cartlyst"
version = "0.0.1-SNAPSHOT"

extra["springAiVersion"] = "1.0.0"
extra["springCloudGcpVersion"] = "6.2.1"
extra["springCloudVersion"] = "2024.0.1"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

configurations {
	compileOnly {
		extendsFrom(configurations.annotationProcessor.get())
	}
}

dependencies {
    implementation("com.rivescript:rivescript-core:0.9.2")
    implementation("com.github.haifengl:smile-nlp:3.0.1")
    implementation("org.apache.opennlp:opennlp-tools:2.3.2")
    implementation("org.springframework.boot:spring-boot-starter")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-validation")
    implementation("org.springframework.boot:spring-boot-starter-web")
    implementation("org.springframework.ai:spring-ai-advisors-vector-store")
    compileOnly("org.projectlombok:lombok")
    developmentOnly("org.springframework.boot:spring-boot-devtools")
    annotationProcessor("org.projectlombok:lombok")
    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("org.springframework.security:spring-security-test")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
    implementation("org.springframework.boot:spring-boot-starter-mail")
    implementation("org.postgresql:postgresql")
    implementation("javax.servlet:javax.servlet-api:4.0.1") {
        because("Needed for HttpServletRequest and other servlet APIs")
    }
    implementation("com.twilio.sdk:twilio:9.12.0")
    implementation("com.squareup.okhttp3:okhttp:4.10.0")
    implementation("org.json:json:20231013")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    
}

dependencyManagement {
	imports {
		mavenBom("org.springframework.ai:spring-ai-bom:${property("springAiVersion")}")
		mavenBom("org.springframework.cloud:spring-cloud-dependencies:${property("springCloudVersion")}")
	}
}

tasks.withType<Test> {
	useJUnitPlatform()
}
