import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { taskService } from '../services/taskService'

export const useTasks = (boardId) => {
  const { tasks, setTasks, addTask, updateTask, deleteTask, setError } = useStore()

  useEffect(() => {
    if (!boardId) return

    loadTasks()
    
    const channel = supabase
      .channel('tasks-channel')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'tasks' },
        (payload) => addTask(payload.new)
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'tasks' },
        (payload) => updateTask(payload.new.id, payload.new)
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'tasks' },
        (payload) => deleteTask(payload.old.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId])

  const loadTasks = async () => {
    try {
      const data = await taskService.getByBoardId(boardId)
      setTasks(data)
    } catch (error) {
      setError(error.message)
      console.error('Error loading tasks:', error)
    }
  }

  const createTask = async (title, listId, description) => {
    try {
      await taskService.create(title, listId, description)
    } catch (error) {
      setError(error.message)
      console.error('Error creating task:', error)
    }
  }

  const updateTaskDetails = async (id, updates) => {
    try {
      await taskService.update(id, updates)
    } catch (error) {
      setError(error.message)
      console.error('Error updating task:', error)
    }
  }

  const removeTask = async (id) => {
    try {
      await taskService.delete(id)
    } catch (error) {
      setError(error.message)
      console.error('Error deleting task:', error)
    }
  }

  const updateTaskPositions = async (updates) => {
    try {
      await taskService.updatePositions(updates)
    } catch (error) {
      setError(error.message)
      console.error('Error updating task positions:', error)
    }
  }

  return {
    tasks,
    createTask,
    updateTask: updateTaskDetails,
    deleteTask: removeTask,
    updateTaskPositions
  }
}
