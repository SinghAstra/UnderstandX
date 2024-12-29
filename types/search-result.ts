export interface SearchResultFile {
  filepath: string;
  type: string;
  repositoryName: string;
  matches: SimilarChunk[];
}

export interface SimilarChunk {
  id: string;
  filepath: string;
  type: string;
  repositoryName: string;
  content: string;
  similarity: number;
}

export interface SearchResult {
  filepath: string;
  type: string;
  repositoryName: string;
  matches: SimilarChunk[];
}
