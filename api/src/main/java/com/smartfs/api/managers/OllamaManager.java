package com.smartfs.api.managers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Service
public class OllamaManager {

    @Value("${ollama.base-url}")
    private String ollamaUrl;

    private final WebClient webClient = WebClient.create();

    public List<Float> getEmbeddings(String text){
        String model = "nomic-embed-text";

        Map<String, Object> request = Map.of(
            "model", model,
                "prompt", text
        );

        Map<String, Object> response = webClient.post()
                .uri(ollamaUrl + "/api/embeddings")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        //List<Double> vector = (List<Double>) response.get("embedding");

        List<Float> arr = (List<Float>) response.get("embedding");
        return arr;
    }
}
