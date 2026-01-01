import { supabase } from '../lib/supabase'

export const boardService = {
  async getAll() {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('is_template', false)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  async getTemplates() {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('is_template', true)
      .order('template_category', { ascending: true })
    
    if (error) throw error
    return data
  },

  async createFromTemplate(templateId, title) {
    const { data: template, error: templateError } = await supabase
      .from('boards')
      .select('*')
      .eq('id', templateId)
      .single()
    
    if (templateError) throw templateError

    const { data: newBoard, error: boardError } = await supabase
      .from('boards')
      .insert([{ 
        title, 
        description: template.description,
        background_color: template.background_color,
        background_image: template.background_image,
        is_template: false
      }])
      .select()
      .single()
    
    if (boardError) throw boardError

    const { data: lists, error: listsError } = await supabase
      .from('lists')
      .select('*')
      .eq('board_id', templateId)
      .order('position', { ascending: true })
    
    if (listsError) throw listsError

    if (lists && lists.length > 0) {
      const newLists = lists.map(list => ({
        title: list.title,
        board_id: newBoard.id,
        position: list.position
      }))

      await supabase.from('lists').insert(newLists)
    }

    return newBoard
  },

  async getById(id) {
    const { data, error } = await supabase
      .from('boards')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  },

  async create(title) {
    const { data, error } = await supabase
      .from('boards')
      .insert([{ title }])
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('boards')
      .update(updates)
      .eq('id', id)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async delete(id) {
    const { error } = await supabase
      .from('boards')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}
