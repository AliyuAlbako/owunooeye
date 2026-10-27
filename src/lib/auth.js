import { supabase } from './supabase'

const editorUid = import.meta.env.VITE_OWUNOYE_EDITOR_UID

export async function isAuthorizedEditor() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user || !editorUid) {
    return false
  }

  return user.id === editorUid
}