import { supabase } from '../lib/supabase'

export const checklistService = {
  async getByTaskId(taskId) {
    const { data, error } = await supabase
      .from('checklist_items')
      .select('*')
      .eq('task_id', taskId)
      .order('position', { ascending: true })
    
    if (error) throw error
    return data
  },

  async create(taskId, title) {
    const { data: existingItems } = await supabase
      .from('checklist_items')
      .select('position')
      .eq('task_id', taskId)
      .order('position', { ascending: false })
      .limit(1)
    
    const position = existingItems?.length > 0 ? existingItems[0].position + 1 : 0

    const { data, error } = await supabase
      .from('checklist_items')
      .insert([{ task_id: taskId, title, position }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('checklist_items')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('checklist_items')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
