import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { boardService } from '../services/boardService'

export const useBoards = () => {
  const { boards, setBoards, addBoard, updateBoard, deleteBoard, setLoading, setError } = useStore()

  useEffect(() => {
    loadBoards()
    
    const channel = supabase
      .channel('boards-channel')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'boards' },
        (payload) => addBoard(payload.new)
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'boards' },
        (payload) => updateBoard(payload.new.id, payload.new)
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'boards' },
        (payload) => deleteBoard(payload.old.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadBoards = async () => {
    try {
      setLoading(true)
      const data = await boardService.getAll()
      setBoards(data)
    } catch (error) {
      setError(error.message)
      console.error('Error loading boards:', error)
    } finally {
      setLoading(false)
    }
  }

  const createBoard = async (title) => {
    try {
      await boardService.create(title)
    } catch (error) {
      setError(error.message)
      console.error('Error creating board:', error)
    }
  }

  const updateBoardTitle = async (id, title) => {
    try {
      await boardService.update(id, { title })
    } catch (error) {
      setError(error.message)
      console.error('Error updating board:', error)
    }
  }

  const removeBoard = async (id) => {
    try {
      await boardService.delete(id)
    } catch (error) {
      setError(error.message)
      console.error('Error deleting board:', error)
    }
  }

  return {
    boards,
    createBoard,
    updateBoard: updateBoardTitle,
    deleteBoard: removeBoard
  }
}
