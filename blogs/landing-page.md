## Landing Page Architecture

### 1. Hero Section: Compelling Value Proposition

- Full-width, dynamic background with subtle code-like animations
- Key Elements:
  - Large, bold headline emphasizing "Democratizing Technical Knowledge"
  - Animated typewriter effect showcasing repository exploration capabilities
  - Prominent CTA button: "Explore Repositories"
  - Background: Subtle SVG/CSS grid resembling code or repository network visualization
  - Micro-interactions: Gentle parallax effect on scroll

### 2. Problem-Solution Framework

- Split section with:
  - Left: Vivid illustration of developer pain points (confusing documentation)
  - Right: Clean, animated mockup showing how the Knowledge Explorer solves these challenges
  - Use Shadcn's card components with smooth hover and transition effects
  - Icons from Lucide React for visual storytelling

### 3. Key Features Showcase

- Grid-based feature presentation
- Each feature card:
  - Compact, modern design
  - Icon representation
  - Short, punchy description
  - Subtle animation on hover
  - Potential interactive elements showing feature preview

### 4. Technical Capabilities Highlight

- Technical radar/spider chart showing capabilities
- Interactive visualization of:
  - Semantic Understanding
  - Intelligent Chunking
  - Visual Exploration
- Animated transitions between different view modes

### 5. Social Proof & Credibility

- Developer testimonials section - Use real life mock data for this
- GitHub star/fork count integration - siteConfig.links.github has github url
- Subtle animations for testimonial carousel

## Design Philosophy

- Color Palette:
  - Primary: Deep blues and teals (tech/trust)
  - Accent: Vibrant, GitHub-inspired green
- Typography:
  - Clean, modern sans-serif
  - Code-friendly font for technical sections
- Animations:

  - Subtle, performance-optimized
  - Focus on meaningful micro-interactions
  - No distracting, heavy animations

  Write Modular Code
  Use Shadcn
  You can take inspiration from SAAS

- You can add colors to global.css
  @import url("https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap");
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

* {
  font-family: "Poppins", system-ui;
  }

@layer base {
:root {
/_ Core background and surface colors _/
--background: 222 47% 5%;
--foreground: 213 31% 91%;

    /* Elevated surfaces */
    --card: 222 47% 7%;
    --card-foreground: 213 31% 91%;
    --popover: 222 47% 7%;
    --popover-foreground: 213 31% 91%;

    /* Primary accent - Vivid blue */
    --primary: 214 95% 65%;
    --primary-foreground: 222 47% 5%;

    /* Secondary - Subtle blue-gray */
    --secondary: 222 47% 11%;
    --secondary-foreground: 213 31% 91%;

    /* Muted elements */
    --muted: 222 47% 11%;
    --muted-foreground: 215 20% 65%;

    /* Accent - Slightly brighter than secondary */
    --accent: 217 19% 27%;
    --accent-foreground: 213 31% 91%;

    /* Destructive actions */
    --destructive: 0 84% 60%;
    --destructive-foreground: 210 40% 98%;

    /* Borders and inputs */
    --border: 222 47% 11%;
    --input: 222 20% 15%;
    --ring: 214 95% 65%;

    /* Radius */
    --radius: 0.875rem;

    --stats-blue: 210 40% 50%; /* Vibrant blue */
    --stats-purple: 270 50% 50%; /* Deep purple */
    --stats-pink: 330 60% 50%; /* Bright pink */
    --stats-teal: 180 50% 40%; /* Teal green */
    --stats-orange: 25 90% 50%; /* Warm orange */

    --stats-green: 120 50% 40%; /* Verdant green */
    --stats-red: 0 70% 50%;

}
}

@layer base {

- {
  @apply border-border;
  }
  body {
  @apply bg-background text-foreground;
  }
  }

body {
overflow-y: auto;
overflow-x: hidden;
scrollbar-width: thin;
}

.no-scrollbar::-webkit-scrollbar {
display: none;
}

.no-scrollbar {
-ms-overflow-style: none;
scrollbar-width: none;
}

::-webkit-scrollbar {
width: 6px;
scrollbar-color: hsl(222 47% 11%);
}

::-webkit-scrollbar-thumb {
background-color: hsl(222 47% 11%);
border-radius: 3px;
}

::-webkit-scrollbar-track {
background: rgba(0, 0, 0, 0);
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
-webkit-box-shadow: 0 0 0 30px hsl(var(--background)) inset !important;
-webkit-text-fill-color: hsl(var(--foreground)) !important;
caret-color: hsl(var(--foreground)) !important;
box-shadow: 0 0 0 30px hsl(var(--background)) inset !important;
}

input:-webkit-autofill:not(:focus) {
-webkit-box-shadow: 0 0 0 1000px hsl(var(--background)) inset !important;
-webkit-text-fill-color: hsl(var(--foreground)) !important;
}

.animate-gradient {
background-size: 300%;
-webkit-animation: animated-gradient 6s ease infinite alternate;
animation: animated-gradient 6s ease infinite alternate;
}

@keyframes animated-gradient {
0% {
background-position: 0% 50%;
}
50% {
background-position: 100% 50%;
}
100% {
background-position: 0% 50%;
}
}

.bg-grid-white {
background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(255 255 255 / 0.04)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
