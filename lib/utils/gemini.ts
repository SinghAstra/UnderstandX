// lib/gemini.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface BatchEmbeddingResponse {
  embeddings: number[];
  error?: string;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    if (!result.embedding) {
      throw new Error("No embedding generated");
    }

    const embedding = [...result.embedding.values];
    return embedding;
  } catch (error) {
    console.log("error --generateEmbedding.");
    console.log("error is ", error);
    throw error;
  }
}

// Batch process embeddings with rate limiting
export async function batchGenerateEmbeddings(
  texts: string[],
  batchSize: number = 5
): Promise<BatchEmbeddingResponse[]> {
  const results: BatchEmbeddingResponse[] = [];
  const totalBatches = Math.ceil(texts.length / batchSize);

  for (let i = 0; i < texts.length; i += batchSize) {
    const currentBatch = Math.floor(i / batchSize) + 1;
    console.log(`Processing batch ${currentBatch}/${totalBatches}`);
    const batch = texts.slice(i, i + batchSize);

    // Process batch with delay to respect rate limits
    const batchResults = await Promise.all(
      batch.map(async (text) => {
        try {
          const embedding: number[] = await generateEmbedding(text);
          return { embeddings: embedding };
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : String(error || "Failed to generate embedding");

          return {
            embeddings: [],
            error: errorMessage,
          };
        }
      })
    );

    results.push(...batchResults);

    // Add delay between batches (500ms)
    if (i + batchSize < texts.length) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }

  return results;
}
