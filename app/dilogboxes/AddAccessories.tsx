import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { GenericMaster } from '@/types/GenericMaster'
import AccessoryForm from '../form/AccessoryForm'

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  editItem: GenericMaster | null
  refresh: () => void
}

export default function AddEditAccessoryDialog({
  open,
  setOpen,
  editItem,
  refresh,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Manage Accessories</DialogTitle>
        </DialogHeader>

        <AccessoryForm
          editItem={editItem}
          onSuccess={() => {
            setOpen(false)
            refresh()
          }}
          onCancel={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
