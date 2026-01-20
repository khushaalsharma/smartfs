package com.smartfs.api.managers;

import com.google.common.util.concurrent.FutureCallback;
import com.google.common.util.concurrent.Futures;
import com.google.common.util.concurrent.ListenableFuture;
import com.google.common.util.concurrent.MoreExecutors;
import io.qdrant.client.QdrantClient;
import io.qdrant.client.grpc.Collections.*;
import jakarta.annotation.PostConstruct;
import io.qdrant.client.grpc.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;
import io.qdrant.client.grpc.Points;

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

    public void checkCollection(String collectionName){
        try{
            ListenableFuture<Collections.CollectionInfo> collection = qdrantClient.getCollectionInfoAsync(collectionName);

            Futures.addCallback(collection, new FutureCallback<CollectionInfo>() {
                @Override
                public void onSuccess(CollectionInfo result) {
                    if (result.getPointsCount() > -1) System.out.println("collection found");
                    else System.out.println("collection not available");
                }

                @Override
                public void onFailure(Throwable t) {
                    t.printStackTrace();
                }
            }, MoreExecutors.directExecutor());
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

            ListenableFuture<Points.UpdateResult> insertedPoint = qdrantClient.upsertAsync(collectionName, List.of(point));
            Futures.addCallback(insertedPoint, new FutureCallback<Points.UpdateResult>() {
                @Override
                public void onSuccess(Points.UpdateResult result) {
                    System.out.println(result.getOperationId());
                }

                @Override
                public void onFailure(Throwable t) {
                    System.out.println("failed to insert data");
                    t.printStackTrace();
                }
            }, MoreExecutors.directExecutor());
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
            checkCollection("file_chunk");

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

    public List<Points.ScoredPoint> findData(String collectionName, List<Double> vector, String userId) throws ExecutionException, InterruptedException {
        List<Float> vectorFloat = vector.stream()
                .map(Double::floatValue)
                .collect(Collectors.toList());

        List<Points.ScoredPoint> pointsList = qdrantClient.searchAsync(
                Points.SearchPoints.newBuilder()
                        .setCollectionName(collectionName)
                        .addAllVector(vectorFloat)
                        .setFilter(
                                Points.Filter.newBuilder()
                                        .addMust(
                                                Points.Condition.newBuilder()
                                                        .setField(
                                                                Points.FieldCondition.newBuilder()
                                                                        .setKey("authorId")
                                                                        .setMatch(Points.Match.newBuilder()
                                                                                .setKeyword(userId)
                                                                                .build())
                                                                        .build()
                                                        )
                                                        .build()
                                        )
                                        .build()
                        )
                        .setLimit(5)
                        .setWithPayload(Points.WithPayloadSelector.newBuilder()
                            .setEnable(true)
                            .build())
                        .build()
        ).get();

        return pointsList;
    }

    public Map<String, Object> convertPayloadToMap(Map<String, JsonWithInt.Value> payload) {
        Map<String, Object> result = new HashMap<>();
        payload.forEach((key, value) -> {
            result.put(key, convertFromValue(value));
        });
        return result;
    }

    private Object convertFromValue(JsonWithInt.Value value) {
        if (value == null) {
            return null;
        }

        switch (value.getKindCase()) {
            case STRING_VALUE:
                return value.getStringValue();

            case INTEGER_VALUE:
                return value.getIntegerValue();

            case DOUBLE_VALUE:
                return value.getDoubleValue();

            case BOOL_VALUE:
                return value.getBoolValue();

            case LIST_VALUE:
                // If you need to handle lists
                return value.getListValue().getValuesList().stream()
                        .map(this::convertFromValue)
                        .collect(Collectors.toList());

            case STRUCT_VALUE:
                // If you need to handle nested objects
                Map<String, Object> map = new HashMap<>();
                value.getStructValue().getFieldsMap().forEach((key, val) ->
                        map.put(key, convertFromValue(val))
                );
                return map;

            case NULL_VALUE:
                return null;

            case KIND_NOT_SET:
            default:
                return null;
        }
    }
}
