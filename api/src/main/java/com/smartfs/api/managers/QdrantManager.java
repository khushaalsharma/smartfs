package com.smartfs.api.managers;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class QdrantManager {

    @Value("${qdrant.base-url}")
    private String qdrantUrl;

    private final WebClient webClient = WebClient.create();

    public void upsertVector(String collection, String id, float[] vector, String text){
        Map<String, Object> request = Map.of(
            "points", List.of(Map.of(
                    "id", id,
                        "vector", vector,
                        "payload", Map.of("text", text)
                ))
        );

        webClient.put()
                .uri(qdrantUrl + "/collections/" + collection + "/points?wait=true")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }

    public void upsertVector(String collection, String id, float[] vector, String text, Map<String, Object> extraPayload) {
        // Merge provided extra payload with the default text field
        Map<String, Object> payload = new HashMap<>();
        payload.put("text", text);
        if (extraPayload != null) {
            payload.putAll(extraPayload);
        }

        Map<String, Object> request = Map.of(
                "points", List.of(Map.of(
                        "id", id,
                        "vector", vector,
                        "payload", payload
                ))
        );

        webClient.put()
                .uri(qdrantUrl + "/collections/" + collection + "/points?wait=true")
                .bodyValue(request)
                .retrieve()
                .bodyToMono(String.class)
                .block();
    }


    public List<String> searchSimilar(String collection, float[] queryVector){
        Map<String, Object> payload = Map.of(
                "vector", queryVector,
                "limit", 5
        );

        Map<String, Object> response = webClient.post()
                .uri(qdrantUrl + "/collections/" + collection + "/points/search")
                .bodyValue(payload)
                .retrieve()
                .bodyToMono(Map.class)
                .block();

        List<Map<String, Object>> results = (List<Map<String, Object>>) response.get("result");
        return results.stream()
                .map(r -> ((Map<String, Object>) r.get("payload")).get("text").toString())
                .toList();
    }
}
