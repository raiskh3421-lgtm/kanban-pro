# Real-Time Kanban Board (Trello-Lite)

A modern, real-time task management application built with React and Supabase. Features drag-and-drop functionality, live updates, and a beautiful responsive UI.

![Kanban Board](https://img.shields.io/badge/React-18.2.0-blue) ![Supabase](https://img.shields.io/badge/Supabase-2.39.0-green) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.0-cyan)

## Features

- **Multiple Boards**: Create, rename, and delete boards
- **List Management**: Add, edit, and remove lists (columns)
- **Task Management**: Create, edit, and delete tasks with descriptions
- **Drag & Drop**: Smooth drag-and-drop tasks between lists
- **Real-Time Updates**: Live synchronization across all connected clients
- **Optimistic UI**: Instant feedback with background sync
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, intuitive interface with smooth animations

## Tech Stack

### Frontend
- **React 18** - UI library with hooks
- **Zustand** - Lightweight state management
- **@dnd-kit** - Modern drag-and-drop library
- **Tailwind CSS** - Utility-first CSS framework
- **Vite** - Fast build tool and dev server

### Backend
- **Supabase** - PostgreSQL database with real-time subscriptions
- **Row Level Security** - Built-in security policies

## Project Structure

```
kanban-board/
├── src/
│   ├── components/          # React components
│   │   ├── Board.jsx       # Main board with drag-drop
│   │   ├── List.jsx        # List/column component
│   │   ├── Task.jsx        # Task card component
│   │   └── Header.jsx      # App header with board selector
│   ├── hooks/              # Custom React hooks
│   │   ├── useBoards.js    # Board CRUD + real-time
│   │   ├── useLists.js     # List CRUD + real-time
│   │   └── useTasks.js     # Task CRUD + real-time
│   ├── services/           # API service layer
│   │   ├── boardService.js # Board database operations
│   │   ├── listService.js  # List database operations
│   │   └── taskService.js  # Task database operations
│   ├── store/              # State management
│   │   └── useStore.js     # Zustand store
│   ├── lib/                # External libraries config
│   │   └── supabase.js     # Supabase client setup
│   ├── App.jsx             # Root component
│   ├── main.jsx            # App entry point
│   └── index.css           # Global styles
├── supabase-schema.sql     # Database schema
├── package.json            # Dependencies
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- A Supabase account (free tier works)

### 1. Clone or Download the Project

```bash
cd "Real-Time Task Management App"
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Supabase

#### Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in project details and wait for setup to complete

#### Run the Database Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase-schema.sql` and paste it
4. Click "Run" to execute the schema

This will create:
- `boards` table
- `lists` table
- `tasks` table
- Indexes for performance
- Row Level Security policies
- Sample data (optional)

#### Get Your API Keys

1. Go to **Project Settings** → **API**
2. Copy your **Project URL**
3. Copy your **anon/public** key

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Start the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:3000`

## Usage Guide

### Creating Your First Board

1. Click "New Board" in the header
2. Enter a board name and press Enter or click "Create"

### Managing Lists

- **Add List**: Click "+ Add List" button
- **Rename List**: Click the pencil icon on any list
- **Delete List**: Click the trash icon (confirms before deleting)

### Managing Tasks

- **Add Task**: Click "+ Add task" in any list
- **Edit Task**: Click the pencil icon on any task
- **Move Task**: Drag and drop tasks between lists
- **Reorder Task**: Drag and drop within the same list
- **Delete Task**: Click the trash icon (confirms before deleting)
- **View Details**: Click on a task to expand its description

### Switching Boards

Use the dropdown in the header to switch between boards.

## Database Schema

### Tables

#### boards
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### lists
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- board_id (UUID, Foreign Key → boards.id)
- position (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### tasks
```sql
- id (UUID, Primary Key)
- title (VARCHAR)
- description (TEXT)
- list_id (UUID, Foreign Key → lists.id)
- position (INTEGER)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Relationships

- One board has many lists (CASCADE DELETE)
- One list has many tasks (CASCADE DELETE)
- Positions are used for ordering within parent

## Real-Time Features

The app uses Supabase real-time subscriptions to sync data:

- **INSERT events**: New items appear instantly
- **UPDATE events**: Changes propagate to all clients
- **DELETE events**: Removals sync immediately

All subscriptions are cleaned up on component unmount to prevent memory leaks.

## Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/kanban-board.git
   git push -u origin main
   ```

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Click "Deploy"

3. **Done!** Your app is live at `your-project.vercel.app`

### Alternative: Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify
3. Add environment variables in Netlify dashboard

## Key Design Decisions

### State Management
- **Zustand** over Redux for simplicity and less boilerplate
- Normalized state structure (separate arrays for boards, lists, tasks)
- Optimistic updates for better UX

### Drag & Drop
- **@dnd-kit** for modern, accessible drag-and-drop
- Handles both list reordering and cross-list transfers
- Position-based ordering in database

### Real-Time
- Separate subscriptions per entity type
- Filtered subscriptions for better performance
- Automatic cleanup on unmount

### Component Architecture
- Functional components with hooks only
- Separation of concerns (UI vs. business logic)
- Custom hooks for data fetching and subscriptions
- Service layer for API calls

## Troubleshooting

### Environment Variables Not Loading
- Ensure `.env` file is in the project root
- Variables must start with `VITE_` for Vite
- Restart dev server after changing `.env`

### Real-Time Not Working
- Check Supabase project is active
- Verify RLS policies allow operations
- Check browser console for errors
- Ensure proper subscription cleanup

### Drag & Drop Issues
- Clear browser cache
- Check for console errors
- Ensure proper task/list structure

### Database Errors
- Verify schema was applied correctly
- Check RLS policies are enabled
- Ensure API keys are correct

## Future Enhancements

- [ ] User authentication with Supabase Auth
- [ ] User-specific boards (private/shared)
- [ ] Task labels and tags
- [ ] Due dates and priorities
- [ ] Task comments and attachments
- [ ] Board templates
- [ ] Activity log
- [ ] Search and filters
- [ ] Dark mode
- [ ] Keyboard shortcuts

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions:
- Check the troubleshooting section
- Review Supabase documentation
- Open an issue on GitHub

---

Built with ❤️ using React and Supabase
