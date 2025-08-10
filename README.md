# UnderstandX

## Project Overview

UnderstandX exists to solve the problem of quickly understanding and navigating large, unfamiliar codebases. It's designed for developers who need to:

-   Onboard to new projects faster.
-   Explore and comprehend the structure of open-source repositories.
-   Quickly locate specific files and understand their purpose.
-   Gain insights into project architecture without extensive manual digging.

**Target Audience:** Software developers, especially those working with TypeScript and React projects.

**Use Cases:**

-   Quickly grasping the architecture of a new project.
-   Finding specific files or components within a large codebase.
-   Understanding the relationships between different parts of a project.
-   Identifying key technologies and dependencies used in a project.

**What Makes UnderstandX Unique:**

-   Focus on TypeScript and React codebases.
-   Integration with GitHub for easy repository analysis.
-   User-friendly interface for exploring code structure and content.
-   Emphasis on visual representation of code relationships.

## Key Features

-   **Repository Analysis:**
    -   Fetches and analyzes public GitHub repositories.
    -   Parses directory structure and file contents.
    -   Identifies key components and dependencies.
-   **Code Exploration:**
    -   Interactive file explorer for navigating the codebase.
    -   File viewer with syntax highlighting and copy functionality.
    -   Markdown rendering for README and other documentation files.
-   **User Authentication:**
    -   Secure user authentication via GitHub and Google.
    -   Session management for persistent user data.
-   **Dashboard:**
    -   Displays a list of user's repositories.
    -   Allows adding new repositories for analysis.
    -   Provides a quick overview of each repository's status.
-   **UI Components:**
    -   Reusable UI components built with Radix UI and Tailwind CSS.
    -   Styled notifications using the `sonner` library.
    -   Loading indicators and placeholder elements for improved UX.
-   **Logs Display:**
    -   Displays repository processing logs in a terminal-like interface.
    -   Uses Pusher for real-time log updates.

## Architecture & Code Organization

UnderstandX follows a modern web application architecture, primarily using Next.js for server-side rendering, routing, and API endpoints. It leverages Prisma as an ORM to interact with a PostgreSQL database.

**Key Components and Interactions:**

-   **Frontend (Next.js):**
    -   Handles user interface and user interactions.
    -   Fetches data from API endpoints.
    -   Renders components using React and TypeScript.
-   **Backend (Next.js API Routes):**
    -   Provides API endpoints for data retrieval and manipulation.
    -   Handles authentication and authorization.
    -   Interacts with the database using Prisma.
-   **Database (PostgreSQL):**
    -   Stores user data, repository metadata, and analysis results.
    -   Managed by Prisma ORM for type-safe database interactions.
-   **Authentication (NextAuth.js):**
    -   Handles user authentication using providers like GitHub and Google.
    -   Manages user sessions and access control.
-   **Realtime Updates (Pusher):**
    -   Provides realtime updates for repository processing logs.

**Directory Structure:**

```
.
├── app                      # Next.js application directory
│   ├── (home)               # Public routes (homepage, landing page)
│   ├── (protected)          # Authenticated routes (dashboard, repository views)
│   ├── api                  # API routes
│   └── styles               # Global styles and CSS files
├── components               # Reusable UI components
│   ├── dashboard            # Dashboard-specific components
│   ├── home                 # Homepage-specific components
│   ├── markdown             # Markdown rendering components
│   ├── providers            # Context providers
│   └── ui                   # Core UI components (buttons, inputs, etc.)
├── config                   # Configuration files
├── hooks                    # Custom React hooks
├── interfaces               # TypeScript interfaces
├── lib                      # Utility functions and libraries
├── prisma                   # Prisma ORM configuration
├── public                   # Static assets
└── scripts                  # Scripts for development and deployment
```

**Key Design Decisions:**

-   **Next.js:** Chosen for its server-side rendering capabilities, routing, and API endpoint handling, providing a performant and scalable platform.
-   **Prisma:** Selected as the ORM for its type safety, ease of use, and ability to generate a fully-typed database client.
-   **Radix UI:** Used for building accessible and customizable UI components, ensuring a consistent and user-friendly experience.
-   **Tailwind CSS:** Adopted for its utility-first approach to styling, enabling rapid UI development and consistent design.

## Technology Stack

-   **Next.js:** React framework for building server-rendered web applications.
-   **TypeScript:** Superset of JavaScript that adds static typing.
-   **React:** JavaScript library for building user interfaces.
-   **Prisma:** ORM for type-safe database access.
-   **PostgreSQL:** Relational database for storing application data.
-   **NextAuth.js:** Authentication library for Next.js applications.
-   **Radix UI:** Set of unstyled, accessible UI primitives.
-   **Tailwind CSS:** Utility-first CSS framework.
-   **Pusher:** Realtime communication platform.
-   **SWR:** React Hooks library for remote data fetching.
-   **Framer Motion:** A production-ready motion library for React.

## Getting Started

1.  **Prerequisites:**

    -   Node.js (version 18 or higher)
    -   npm or yarn package manager
    -   PostgreSQL database
    -   GitHub account (for authentication)
    -   Pusher account (for realtime updates)

2.  **Installation:**

    ```bash
    git clone <repository-url>
    cd <repository-directory>
    npm install # or yarn install
    ```

3.  **Configuration:**

    -   Create a `.env.local` file in the project root.
    -   Add the following environment variables:

    ```
    DATABASE_URL="postgresql://user:password@host:port/database"
    GITHUB_CLIENT_ID="your-github-client-id"
    GITHUB_CLIENT_SECRET="your-github-client-secret"
    NEXTAUTH_SECRET="your-nextauth-secret"
    NEXTAUTH_URL="http://localhost:3000" # or your deployment URL
    PUSHER_APP_ID="your-pusher-app-id"
    PUSHER_APP_KEY="your-pusher-app-key"
    PUSHER_APP_SECRET="your-pusher-app-secret"
    PUSHER_APP_CLUSTER="your-pusher-app-cluster"
    ```

4.  **Database Setup:**

    ```bash
    npx prisma migrate dev --name init
    npx prisma db seed
    ```

5.  **Development Server:**

    ```bash
    npm run dev # or yarn dev
    ```

    Open your browser and navigate to `http://localhost:3000`.

6.  **Common Development Commands:**

    -   `npm run dev`: Start the development server.
    -   `npm run build`: Build the application for production.
    -   `npm run start`: Start the production server.
    -   `npm run lint`: Run ESLint to check for code quality issues.
    -   `npm run format`: Format the code using Prettier.
    -   `npx prisma migrate dev`: Create and apply database migrations.
    -   `npx prisma studio`: Open the Prisma Studio to view and manage the database.

## Project Structure

-   **`app/`:** Contains the Next.js application routes and pages.
    -   **`app/(home)/`:** Public routes, including the landing page and authentication-related pages.
    -   **`app/(protected)/`:** Routes that require user authentication, such as the dashboard and repository views.
    -   **`app/api/`:** API routes for handling data retrieval and manipulation.
    -   **`app/styles/`:** Global CSS styles and theme definitions.
-   **`components/`:** Reusable UI components used throughout the application.
    -   **`components/ui/`:** Core UI components like buttons, inputs, and modals.
    -   **`components/dashboard/`:** Components specific to the user dashboard.
    -   **`components/home/`:** Components used on the landing page.
    -   **`components/markdown/`:** Components for rendering Markdown content.
    -   **`components/providers/`:** React context providers for managing application state.
-   **`config/`:** Configuration files for the application.
    -   **`config/site.ts`:** Contains site-specific information like name, description, and URLs.
-   **`hooks/`:** Custom React hooks for managing state and side effects.
    -   **`hooks/use-toast.ts`:** Custom hook for managing toast notifications.
-   **`interfaces/`:** TypeScript interfaces for defining data structures.
    -   **`interfaces/github.ts`:** Interfaces for GitHub API responses.
    -   **`interfaces/next-auth.ts`:** Extensions to the NextAuth.js types.
-   **`lib/`:** Utility functions and libraries.
    -   **`lib/prisma.ts`:** Initializes and exports the Prisma client.
    -   **`lib/auth-options.ts`:** Configures the authentication options for NextAuth.js.
    -   **`lib/utils.ts`:** Utility functions for class name merging and API requests.
-   **`prisma/`:** Prisma ORM configuration.
    -   **`prisma/schema.prisma`:** Defines the database schema.
    -   **`prisma/migrations/`:** Database migration files.
-   **`public/`:** Static assets like images and fonts.
-   **`scripts/`:** Scripts for development and deployment.