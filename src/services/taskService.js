import { supabase } from '../lib/supabase'

export const taskService = {
  async getByBoardId(boardId) {
    const { data, error } = await supabase
      .from('tasks')
      .select(`
        *,
        lists!inner(board_id),
        members(id, name, email, color, avatar_url),
        task_labels(label_id, labels(id, name, color))
      `)
      .eq('lists.board_id', boardId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data
  },

  async create(title, listId, description = '') {
    const { data: existingTasks } = await supabase
      .from('tasks')
      .select('position')
      .eq('list_id', listId)
      .order('position', { ascending: false })
      .limit(1)
    
    const position = existingTasks?.length > 0 ? existingTasks[0].position + 1 : 0

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ title, list_id: listId, description, position }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('tasks')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updatePositions(updates) {
    const promises = updates.map(({ id, position, list_id }) =>
      supabase
        .from('tasks')
        .update({ position, list_id })
        .eq('id', id)
    )
    
    const results = await Promise.all(promises)
    const error = results.find(r => r.error)?.error
    if (error) throw error
  },

  async delete(id) {
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
