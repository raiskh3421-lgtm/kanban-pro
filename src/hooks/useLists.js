import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { listService } from '../services/listService'

export const useLists = (boardId) => {
  const { lists, setLists, addList, updateList, deleteList, setError } = useStore()

  useEffect(() => {
    if (!boardId) return

    loadLists()
    
    const channel = supabase
      .channel('lists-channel')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'lists', filter: `board_id=eq.${boardId}` },
        (payload) => addList(payload.new)
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'lists', filter: `board_id=eq.${boardId}` },
        (payload) => updateList(payload.new.id, payload.new)
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'lists' },
        (payload) => deleteList(payload.old.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId])

  const loadLists = async () => {
    try {
      const data = await listService.getByBoardId(boardId)
      setLists(data)
    } catch (error) {
      setError(error.message)
      console.error('Error loading lists:', error)
    }
  }

  const createList = async (title) => {
    try {
      await listService.create(title, boardId)
    } catch (error) {
      setError(error.message)
      console.error('Error creating list:', error)
    }
  }

  const updateListTitle = async (id, title) => {
    try {
      await listService.update(id, { title })
    } catch (error) {
      setError(error.message)
      console.error('Error updating list:', error)
    }
  }

  const removeList = async (id) => {
    try {
      await listService.delete(id)
    } catch (error) {
      setError(error.message)
      console.error('Error deleting list:', error)
    }
  }

  const updateListPositions = async (updates) => {
    try {
      await listService.updatePositions(updates)
    } catch (error) {
      setError(error.message)
      console.error('Error updating list positions:', error)
    }
  }

  return {
    lists,
    createList,
    updateList: updateListTitle,
    deleteList: removeList,
    updateListPositions
  }
}
