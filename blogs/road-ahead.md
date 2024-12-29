Let's plan out the file preview functionality for the selected files. I'll break this down into key components and features we need to consider.

1. Core Functionality Requirements:

- Fetch complete file content from GitHub API when a file is selected
- Display the full file content with syntax highlighting
- Highlight the similar chunks that were found in the search
- Show line numbers for easier reference
- Support scrolling for longer files

2. GitHub API Integration:

- We'll need to fetch the raw file content using GitHub's API
- Required parameters: repository owner, repo name, file path, and branch/commit
- Consider caching the file content to avoid repeated API calls
- Handle API rate limiting gracefully

3. UI/UX Design Components:

- Code viewer with syntax highlighting
- Scrollable container with fixed header
- Line numbers panel
- Highlight overlays for matching chunks
- Loading state while fetching
- Error state handling
- "Copy code" button
- File metadata display (path, size, last modified)

4. Technical Considerations:

- Use a code highlighting library (e.g., Prism.js, highlight.js)
- Implement virtual scrolling for large files
- Calculate highlight positions based on chunk locations
- Handle different file types appropriately
- Consider mobile responsiveness
- Add keyboard navigation support

5. Data Flow:
1. User selects a file from search results
1. Fetch complete file content from GitHub API
1. Process the content to add syntax highlighting
1. Map similar chunks to line numbers/positions
1. Render the file with highlights
1. Update the UI as user scrolls/interacts

Would you like me to expand on any of these aspects before we move to implementation?
