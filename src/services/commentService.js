import { supabase } from '../lib/supabase'

export const commentService = {
  async getByTaskId(taskId) {
    const { data, error } = await supabase
      .from('comments')
      .select(`
        *,
        members (
          id,
          name,
          avatar_url,
          color
        )
      `)
      .eq('task_id', taskId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  },

  async create(taskId, memberId, content) {
    const { data, error } = await supabase
      .from('comments')
      .insert([{ task_id: taskId, member_id: memberId, content }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, content) {
    const { data, error } = await supabase
      .from('comments')
      .update({ content })
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('comments')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
