import { client } from "../utils/config.qdrant.js";
import { pipeline } from "@xenova/transformers";
import {v4 as uuidv4} from "uuid";

const COLLECTION_NAME = "file_chunk";

export function chunkText(text, chunkSize = 500, overlap = 50) {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = start + chunkSize;
    chunks.push(text.slice(start, end));
    start += chunkSize - overlap;
  }
  return chunks;
}

export async function storeChunks(fileId, text) {
  const chunks = chunkText(text);
  const points = [];

  const chunkIds = [];

  for (let i = 0; i < chunks.length; i++) {
    const embedding = await embedText(chunks[i]);
    const id = uuidv4();
    points.push({
      id: id,
      vector: embedding,
      payload: {
        file_id: fileId,
        chunk_index: i,
        text: chunks[i],
      },
    });

    chunkIds.push(id);
  }

  await client.upsert(COLLECTION_NAME, { points: points });
}

//generate embedding
let embedder;

async function loadModel() {
  if (!embedder) {
    // MiniLM-L6-v2 → small & fast (384-dim embeddings)
    embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }
  return embedder;
}

export async function  embedText(text) {
  const model = await loadModel();

  // Get embeddings
  const output = await model(text, { pooling: "mean", normalize: true });

  // output is a Float32Array → convert to plain JS array for Qdrant
  return Array.from(output.data);
}


export async function searchChunks(query, topK = 5) {
  // Generate embedding for the query
  const queryEmbedding = await embedText(query);

  // Search in Qdrant
  const result = await qdrant.search(COLLECTION_NAME, {
    vector: queryEmbedding,
    limit: topK,
  });

  // Map results into useful structure
  return result.map((hit) => ({
    text: hit.payload.text,
    score: hit.score,
    file_id: hit.payload.file_id,
    chunk_index: hit.payload.chunk_index,
  }));
}