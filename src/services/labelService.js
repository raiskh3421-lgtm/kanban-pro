import { supabase } from '../lib/supabase'

export const labelService = {
  async getByBoardId(boardId) {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .eq('board_id', boardId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async create(boardId, name, color) {
    const { data, error } = await supabase
      .from('labels')
      .insert([{ board_id: boardId, name, color }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('labels')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('labels')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
