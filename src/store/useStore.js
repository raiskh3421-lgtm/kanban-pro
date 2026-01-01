import { create } from 'zustand'

export const useStore = create((set, get) => ({
  boards: [],
  currentBoard: null,
  lists: [],
  tasks: [],
  labels: [],
  members: [],
  checklistItems: [],
  comments: [],
  templates: [],
  loading: false,
  error: null,
  darkMode: false,
  searchQuery: '',
  filters: {
    priority: null,
    labels: [],
    assignee: null,
    dueDateRange: null
  },

  setBoards: (boards) => set({ boards }),
  
  setCurrentBoard: (board) => set({ currentBoard: board }),
  
  setLists: (lists) => set({ 
    lists: lists.sort((a, b) => a.position - b.position) 
  }),
  
  setTasks: (tasks) => set({ 
    tasks: tasks.sort((a, b) => a.position - b.position) 
  }),

  setLabels: (labels) => set({ labels }),

  setMembers: (members) => set({ members }),

  setChecklistItems: (checklistItems) => set({ checklistItems }),

  setComments: (comments) => set({ comments }),

  setTemplates: (templates) => set({ templates }),
  
  setLoading: (loading) => set({ loading }),
  
  setError: (error) => set({ error }),

  setDarkMode: (darkMode) => set({ darkMode }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setFilters: (filters) => set({ filters }),

  addBoard: (board) => set((state) => ({ 
    boards: [...state.boards, board] 
  })),

  updateBoard: (id, updates) => set((state) => ({
    boards: state.boards.map(b => b.id === id ? { ...b, ...updates } : b),
    currentBoard: state.currentBoard?.id === id 
      ? { ...state.currentBoard, ...updates } 
      : state.currentBoard
  })),

  deleteBoard: (id) => set((state) => ({
    boards: state.boards.filter(b => b.id !== id),
    currentBoard: state.currentBoard?.id === id ? null : state.currentBoard
  })),

  addList: (list) => set((state) => ({ 
    lists: [...state.lists, list].sort((a, b) => a.position - b.position) 
  })),

  updateList: (id, updates) => set((state) => ({
    lists: state.lists
      .map(l => l.id === id ? { ...l, ...updates } : l)
      .sort((a, b) => a.position - b.position)
  })),

  deleteList: (id) => set((state) => ({
    lists: state.lists.filter(l => l.id !== id),
    tasks: state.tasks.filter(t => t.list_id !== id)
  })),

  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task].sort((a, b) => a.position - b.position) 
  })),

  updateTask: (id, updates) => set((state) => ({
    tasks: state.tasks
      .map(t => t.id === id ? { ...t, ...updates } : t)
      .sort((a, b) => a.position - b.position)
  })),

  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter(t => t.id !== id),
    checklistItems: state.checklistItems.filter(c => c.task_id !== id),
    comments: state.comments.filter(c => c.task_id !== id)
  })),

  addLabel: (label) => set((state) => ({
    labels: [...state.labels, label]
  })),

  updateLabel: (id, updates) => set((state) => ({
    labels: state.labels.map(l => l.id === id ? { ...l, ...updates } : l)
  })),

  deleteLabel: (id) => set((state) => ({
    labels: state.labels.filter(l => l.id !== id)
  })),

  addMember: (member) => set((state) => ({
    members: [...state.members, member]
  })),

  updateMember: (id, updates) => set((state) => ({
    members: state.members.map(m => m.id === id ? { ...m, ...updates } : m)
  })),

  deleteMember: (id) => set((state) => ({
    members: state.members.filter(m => m.id !== id)
  })),

  addChecklistItem: (item) => set((state) => ({
    checklistItems: [...state.checklistItems, item]
  })),

  updateChecklistItem: (id, updates) => set((state) => ({
    checklistItems: state.checklistItems.map(c => c.id === id ? { ...c, ...updates } : c)
  })),

  deleteChecklistItem: (id) => set((state) => ({
    checklistItems: state.checklistItems.filter(c => c.id !== id)
  })),

  addComment: (comment) => set((state) => ({
    comments: [...state.comments, comment]
  })),

  updateComment: (id, updates) => set((state) => ({
    comments: state.comments.map(c => c.id === id ? { ...c, ...updates } : c)
  })),

  deleteComment: (id) => set((state) => ({
    comments: state.comments.filter(c => c.id !== id)
  })),

  getTasksByListId: (listId) => {
    const { tasks, searchQuery, filters } = get()
    let filteredTasks = tasks.filter(t => t.list_id === listId)

    if (searchQuery) {
      filteredTasks = filteredTasks.filter(t => 
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (filters.priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === filters.priority)
    }

    if (filters.assignee) {
      filteredTasks = filteredTasks.filter(t => t.assigned_to === filters.assignee)
    }

    if (filters.labels.length > 0) {
      filteredTasks = filteredTasks.filter(t => 
        t.task_labels?.some(tl => filters.labels.includes(tl.label_id))
      )
    }

    return filteredTasks
  },

  getChecklistItemsByTaskId: (taskId) => {
    const { checklistItems } = get()
    return checklistItems.filter(c => c.task_id === taskId).sort((a, b) => a.position - b.position)
  },

  getCommentsByTaskId: (taskId) => {
    const { comments } = get()
    return comments.filter(c => c.task_id === taskId)
  }
}))
