# Dashboard Layout Documentation

## Main Layout Structure

The dashboard implements a three-column layout with fixed navigation and sidebars:

1. Navigation Bar (Fixed Top)

- Position: Fixed at top
- Height: 64px (h-16)
- Background: Semi-transparent with blur effect
- Contains: Site name, "Connect Repository" button, and user authentication controls

2. Main Content Area

- Three-column structure:
  - Left Sidebar (Repository Management)
  - Main Content
  - Right Sidebar (Tools)
- Begins below navbar (pt-16)

## Component Breakdown

### Navigation Bar (Navbar)

- Fixed positioning with z-index 50
- Features:
  - Left: Site name
  - Right: Repository connection button and user authentication
  - Implements user session management
  - Responsive design with loading states
  - Blur effect support for modern browsers

### Left Sidebar (Repository Management)

- Fixed width: 384px (w-96)
- Features:
  - Repository search functionality
  - Debounced search implementation
  - Repository list with loading states
  - Real-time updates
  - Error handling with toast notifications

### Main Content Area

- Flexible width (flex-1)
- Left margin: 384px (ml-96)
- Contains the CommandPaletteRepoForm component:
  - GitHub repository URL input
  - Validation system
  - Processing states
  - Error handling
  - Keyboard shortcuts (Cmd/Ctrl + K)
  - Success/failure animations

### Right Sidebar (Tools)

- Fixed width: 320px (w-80)
- Features:
  - ChatRepoX integration card
  - Coming soon section
  - Tool ecosystem overview
  - Interactive elements for future features

## Technical Implementation Details

### State Management

- Uses React hooks for state management
- Implements session management via next-auth
- Handles loading and error states
- Uses debounced callbacks for search optimization

### Styling

- Utilizes Tailwind CSS for styling
- Implements responsive design patterns
- Uses backdrop blur effects where supported
- Consistent spacing and layout system

### User Experience

- Keyboard shortcuts support
- Loading skeletons for better UX
- Animated transitions and feedback
- Error handling with user-friendly messages

### Integration Points

- GitHub repository processing
- Authentication system
- API endpoints for repository management
- Real-time updates and search functionality
