import { supabase } from '../lib/supabase'

export const memberService = {
  async getAll() {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data
  },

  async create(name, email, color) {
    const { data, error } = await supabase
      .from('members')
      .insert([{ name, email, color }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('members')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('members')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
