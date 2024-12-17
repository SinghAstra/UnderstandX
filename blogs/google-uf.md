graph TD
A[Start] --> B{Authenticate with Google}
B --> |Success| C[Dashboard]
C --> D[Manual Repository Submission]
D --> E[Enter Repository URL]
E --> F[Validate Repository]
F --> G{Repository Valid?}
G --> |Yes| H[Start Processing]
G --> |No| I[Show Validation Error]
