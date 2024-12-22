A. Authentication Flow:

1. User lands on homepage
2. Clicks "Get Started"
3. Signs in with GitHub/Google
4. Redirected to dashboard

B. Repository Addition Flow:

1. User clicks "Add Repository" from dashboard
2. Two options presented:
   - Direct URL input
   - GitHub repository picker (only for GitHub auth users)
3. After submission:
   - Redirect to processing status page
   - Show real-time updates via WebSocket
4. Once complete, redirect to repository view

C. Search Flow:

1. User enters search query
2. System searches across all public repositories
3. Results shown with relevance scoring
4. Click result to view in context

D. Repository Viewing Flow:

1. Public repos: /repositories/:owner/:name
2. Private repos: /r/:id (requires auth)
3. Both show:
   - Repository overview
   - File browser
   - Semantic search within repo
   - Knowledge graph visualization
