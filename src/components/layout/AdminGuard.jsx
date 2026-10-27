import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { supabase } from '../../lib/supabase'
import { isAuthorizedEditor } from '../../lib/auth'

export default function AdminGuard() {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    let active = true

    async function checkAccess() {
      const allowed = await isAuthorizedEditor()
      if (active) setStatus(allowed ? 'allowed' : 'denied')
    }

    checkAccess()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      checkAccess()
    })

    return () => {
      active = false
      subscription.unsubscribe()
    }
  }, [])

  if (status === 'checking') {
    return <div className="p-10 text-center">Checking editor access...</div>
  }

  if (status === 'denied') {
    return <Navigate to="/admin/login" replace />
  }

  return <Outlet />
}