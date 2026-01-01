import { supabase } from '../lib/supabase'

export const taskLabelService = {
  async addLabel(taskId, labelId) {
    const { data, error } = await supabase
      .from('task_labels')
      .insert([{ task_id: taskId, label_id: labelId }])
      .select()
    
    if (error) throw error
    return data
  },

  async removeLabel(taskId, labelId) {
    const { error } = await supabase
      .from('task_labels')
      .delete()
      .eq('task_id', taskId)
      .eq('label_id', labelId)
    
    if (error) throw error
  },

  async getTaskLabels(taskId) {
    const { data, error } = await supabase
      .from('task_labels')
      .select('label_id, labels(*)')
      .eq('task_id', taskId)
    
    if (error) throw error
    return data
  }
}
