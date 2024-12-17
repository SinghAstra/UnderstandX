graph TD
A[Start] --> B{Authenticate with GitHub}
B --> |Success| C[Dashboard]
C --> D{Choose Import Method}
D --> |Manual URL| E[Enter Repository URL]
D --> |Direct Import| F[Select from GitHub Repositories]
E --> G[Validate Repository]
F --> G
G --> H{Repository Processable?}
H --> |Yes| I[Start Processing Job]
I --> J[Redirect to Repository Page]
H --> |No| K[Show Error]
