import { supabase } from '../lib/supabase'

export const listService = {
  async getByBoardId(boardId) {
    const { data, error } = await supabase
      .from('lists')
      .select('*')
      .eq('board_id', boardId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data
  },

  async create(title, boardId) {
    const { data: existingLists } = await supabase
      .from('lists')
      .select('position')
      .eq('board_id', boardId)
      .order('position', { ascending: false })
      .limit(1)
    
    const position = existingLists?.length > 0 ? existingLists[0].position + 1 : 0

    const { data, error } = await supabase
      .from('lists')
      .insert([{ title, board_id: boardId, position }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('lists')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePositions(updates) {
    const promises = updates.map(({ id, position }) =>
      supabase
        .from('lists')
        .update({ position })
        .eq('id', id)
    )
    
    const results = await Promise.all(promises)
    const error = results.find(r => r.error)?.error
    if (error) throw error
  },

  async delete(id) {
    const { error } = await supabase
      .from('lists')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
