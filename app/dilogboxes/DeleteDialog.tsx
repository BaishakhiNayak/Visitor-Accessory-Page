'use client'

import api from '@/utils/api'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { toast } from 'react-toastify'


type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  id: number | null
  refresh: () => void
}

export default function DeleteConfirmDialog({
  open,
  setOpen,
  id,
  refresh,
}: Props) {
  
const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
  if (!id) return

  try {
    setLoading(true)
    await api.delete(`/generic-masters/${id}`)
    toast.success('Record Deleted successfully')
    setOpen(false)
    refresh()
  } catch (err: any) {
    toast.error(
      err.response?.data?.message || 'Delete failed'
    )
  } finally {
    setLoading(false)
  }
}


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm!</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Are you sure you want to delete ?
        </p>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={() => setOpen(false)}>
            No
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Yes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
