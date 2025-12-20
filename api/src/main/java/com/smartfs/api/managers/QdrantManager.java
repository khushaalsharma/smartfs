package com.smartfs.api.managers;

import com.google.common.util.concurrent.ListenableFuture;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections.*;
import jakarta.annotation.PostConstruct;
import io.qdrant.client.grpc.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
@Slf4j
public class QdrantManager {

    private final QdrantClient qdrantClient;

    public QdrantManager(QdrantClient qdrantClient) {
        this.qdrantClient = qdrantClient;
    }

    public void createCollection(String collectionName, int vectorSize){
        try {
            VectorParams vectorParams = VectorParams.newBuilder()
                    .setSize(vectorSize)
                    .setDistance(Collections.Distance.Cosine)
                    .build();

            qdrantClient.createCollectionAsync(collectionName, vectorParams);
        } catch (Exception e) {
            throw new RuntimeException("Failed to create the collection: " + e);
        }
    }

    public boolean checkCollection(String collectionName){
        try{
            ListenableFuture<Collections.CollectionInfo> collection = qdrantClient.getCollectionInfoAsync(collectionName);
            return (collection != null);
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public void upsertVector(String collectionName, List<Double> vector, Map<String, Object> payload){
        String pointId = UUID.randomUUID().toString();

        try{
            Points.PointStruct point = Points.PointStruct.newBuilder()
                    .setId(id(pointId))
                    .setVectors(vectors(vector))
                    .putAllPayload(convertPayload((payload)))
                    .build();

            var output = qdrantClient.upsertAsync(collectionName, List.of(point));
            if(output.isDone()){
                System.out.println("Insertion complete at Qdrant");
            }
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    private Points.PointId id(String id){
        return Points.PointId.newBuilder().setUuid(id).build();
    }

    private Points.Vectors vectors(List<Double> vector){
        return Points.Vectors.newBuilder()
                .setVector(Points.Vector.newBuilder()
                        .addAllData(vector.stream()
                                .map(Double::floatValue)
                                .collect(Collectors.toList()))
                        .build())
                .build();
    }

    private Map<String, JsonWithInt.Value> convertPayload(Map<String, Object> payload) {
        return payload.entrySet().stream()
                .collect(Collectors.toMap(
                        Map.Entry::getKey,
                        e -> convertToValue(e.getValue())
                ));
    }

    private JsonWithInt.Value convertToValue(Object obj){
        if (obj instanceof String) {
            return JsonWithInt.Value.newBuilder().setStringValue((String) obj).build();
        } else if (obj instanceof Integer) {
            return  JsonWithInt.Value.newBuilder().setIntegerValue((Integer) obj).build();
        } else if (obj instanceof Long) {
            return  JsonWithInt.Value.newBuilder().setIntegerValue((Long) obj).build();
        } else if (obj instanceof Double) {
            return  JsonWithInt.Value.newBuilder().setDoubleValue((Double) obj).build();
        } else if (obj instanceof Boolean) {
            return  JsonWithInt.Value.newBuilder().setBoolValue((Boolean) obj).build();
        }
        return  JsonWithInt.Value.newBuilder().setStringValue(obj.toString()).build();
    }

    @PostConstruct
    private boolean pingDB(){
        try {
            System.out.println("Checking health");
            var output = qdrantClient.healthCheckAsync().get();

            return output != null;
        } catch (ExecutionException e) {
            System.out.println("failed: " + e);
            System.out.println("root cause: " + e.getCause());
            e.printStackTrace();
            throw new RuntimeException("Failed to ping the database", e.getCause());

        } catch (InterruptedException e) {
            System.out.println("failed to ping InterruptedException: " + e);
            Thread.currentThread().interrupt();
            throw new RuntimeException("Failed to ping the database", e);

        } catch (Exception e) {
            System.out.println("failed to ping RuntimeException: " + e);
            throw new RuntimeException("Failed to ping the database", e);
        }
    }
}
