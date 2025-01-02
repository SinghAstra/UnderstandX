export interface SearchResultFile {
  filepath: string;
  type: string;
  repositoryName: string;
  repositoryFullName: string;
  similarChunks: SimilarChunk[];
}

export interface SimilarChunk {
  id: string;
  filepath: string;
  type: string;
  repositoryName: string;
  repositoryFullName: string;
  content: string;
  similarity: number;
}
