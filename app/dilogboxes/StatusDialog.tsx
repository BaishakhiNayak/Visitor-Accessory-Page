'use client'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import api from '@/utils/api'
import { GenericMaster } from '@/types/GenericMaster'
import { useState } from 'react'

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  item: GenericMaster | null
  newStatus: number
  onCancel: () => void
  refresh: () => void
}

export default function StatusDialog({
  open,
  setOpen,
  item,
  newStatus,
  onCancel,
  refresh,
}: Props) {

    const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    if (!item) return

    setLoading(true)

    await api.patch(`/generic-masters/${item.master_id}`, {
      status: newStatus,
    })

    setOpen(false)
    refresh()
     setLoading(false)
  }

  const handleCancel = () => {
    setOpen(false)
    onCancel()
  }

  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Confirm!</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-gray-600">
          Are you sure you want to change the status?
        </p>

        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            No
          </Button>
          <Button onClick={handleConfirm} disabled={loading}>
             {loading ? 'Updating...' : 'Yes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
