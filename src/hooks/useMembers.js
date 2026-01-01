import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useStore } from '../store/useStore'
import { memberService } from '../services/memberService'

export const useMembers = () => {
  const { members, setMembers, addMember, updateMember, deleteMember, setError } = useStore()

  useEffect(() => {
    loadMembers()
    
    const channel = supabase
      .channel('members-channel')
      .on('postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'members' },
        (payload) => addMember(payload.new)
      )
      .on('postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'members' },
        (payload) => updateMember(payload.new.id, payload.new)
      )
      .on('postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'members' },
        (payload) => deleteMember(payload.old.id)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadMembers = async () => {
    try {
      const data = await memberService.getAll()
      setMembers(data)
    } catch (error) {
      setError(error.message)
      console.error('Error loading members:', error)
    }
  }

  const createMember = async (name, email, color) => {
    try {
      await memberService.create(name, email, color)
    } catch (error) {
      setError(error.message)
      console.error('Error creating member:', error)
    }
  }

  const updateMemberData = async (id, updates) => {
    try {
      await memberService.update(id, updates)
    } catch (error) {
      setError(error.message)
      console.error('Error updating member:', error)
    }
  }

  const removeMember = async (id) => {
    try {
      await memberService.delete(id)
    } catch (error) {
      setError(error.message)
      console.error('Error deleting member:', error)
    }
  }

  return {
    members,
    createMember,
    updateMember: updateMemberData,
    deleteMember: removeMember
  }
}
