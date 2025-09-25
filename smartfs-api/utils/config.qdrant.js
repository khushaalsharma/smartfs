import {QdrantClient} from '@qdrant/js-client-rest';
import { configDotenv } from 'dotenv';

configDotenv();

const COLLECTION_NAME = "file_chunk";

export const client = new QdrantClient({
    url: process.env.QDRANT_URL,
    apiKey: process.env.QDRANT_KEY,
});

const checkCollection = async() => {
    try{
        await client.getCollection(COLLECTION_NAME);
        return true;
    }catch(err){
        console.log(err);
    }

    return false;
}

const qdrantConfig = async() => {
    try {
        if(!(await checkCollection())){
            await client.createCollection(COLLECTION_NAME, {
                vectors: {
                    size: 384,
                    distance: "Cosine"
                }
            });

            console.log("collection created");
        }
    } catch (err) {
        console.error('Could not get collections:', err);
    }

    console.log("config for draft over");
}

export default qdrantConfig;