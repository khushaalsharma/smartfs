package com.smartfs.api.configs;

import io.qdrant.client.QdrantClient;
import io.qdrant.client.QdrantGrpcClient;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class QdrantConfig {

    @Value("${qdrant.host}")
    private String qdrantHost;

    @Value("${qdrant.port.parseInt():6333}")
    private int qdrantPort;

    @Value("${qdrant.api-key}")
    private String qdrantApi;

    @Value("${qdrant.use-tls:true}")
    private boolean useTls;

    @Bean
    public QdrantClient qdrantClient(){
        return new QdrantClient(
                QdrantGrpcClient.newBuilder(qdrantHost, qdrantPort, useTls)
                        .withApiKey(qdrantApi)
                        .build()
        );
    }
}
