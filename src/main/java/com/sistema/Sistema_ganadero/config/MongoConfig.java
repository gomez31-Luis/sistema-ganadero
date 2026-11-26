package com.sistema.Sistema_ganadero.config;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.core.MongoTemplate;

/**
 * Clase de configuración manual para MongoDB.
 * La creamos para forzar que el sistema use la base de datos "sistema_ganadero" 
 * y no la base de datos "test" por defecto.
 */
@Configuration
public class MongoConfig {

    /**
     * Crea la conexión con el servidor de MongoDB que corre en tu PC (localhost).
     */
    @Bean
    public MongoClient mongoClient() {
        return MongoClients.create("mongodb://localhost:27017");
    }

    /**
     * Define qué base de datos vamos a usar dentro de ese servidor.
     */
    @Bean
    public MongoTemplate mongoTemplate() {
        return new MongoTemplate(mongoClient(), "sistema_ganadero");
    }
}

