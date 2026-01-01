import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { labelService } from '../services/labelService'

export const useLabels = (boardId) => {
  const { labels, setLabels, addLabel, updateLabel, deleteLabel, setError } = useStore()

  useEffect(() => {
    if (!boardId) return

    loadLabels()
    
    const channel = supabase
      .channel('labels-channel')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'labels', filter: `board_id=eq.${boardId}` },
        (payload) => addLabel(payload.new)
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'labels', filter: `board_id=eq.${boardId}` },
        (payload) => updateLabel(payload.new.id, payload.new)
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'labels' },
        (payload) => deleteLabel(payload.old.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [boardId])

  const loadLabels = async () => {
    try {
      const data = await labelService.getByBoardId(boardId)
      setLabels(data)
    } catch (error) {
      setError(error.message)
      console.error('Error loading labels:', error)
    }
  }

  const createLabel = async (name, color) => {
    try {
      await labelService.create(boardId, name, color)
    } catch (error) {
      setError(error.message)
      console.error('Error creating label:', error)
    }
  }

  const updateLabelData = async (id, updates) => {
    try {
      await labelService.update(id, updates)
    } catch (error) {
      setError(error.message)
      console.error('Error updating label:', error)
    }
  }

  const removeLabel = async (id) => {
    try {
      await labelService.delete(id)
    } catch (error) {
      setError(error.message)
      console.error('Error deleting label:', error)
    }
  }

  return {
    labels,
    createLabel,
    updateLabel: updateLabelData,
    deleteLabel: removeLabel
  }
}
