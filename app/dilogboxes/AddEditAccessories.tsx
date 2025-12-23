'use client'

import { useEffect } from 'react'
import api from '@/utils/api'
import { GenericMaster } from '@/types/GenericMaster'
import { GenericMasterModuleType } from '@/constants/GenericMasterModuleType'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'


type FormValues = {
  name: string
  description?: string | null
}

type Props = {
  open: boolean
  setOpen: (value: boolean) => void
  editItem: GenericMaster | null
  refresh: () => void
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
})

export default function AddEditAccessoryDialog({
  open,
  setOpen,
  editItem,
  refresh,
}: Props) {
  
  const {
  register,
  handleSubmit,
  reset,
  formState: { errors, isSubmitting },
} = useForm<FormValues>({
    resolver: yupResolver(schema),
  })


  useEffect(() => {
  if (editItem) {
    reset({
      name: editItem.name,
      description: editItem.description ?? '',
    })
  } else {
    reset({
      name: '',
      description: '',
    })
  }
}, [editItem, reset])


  const onSubmit = async (values: FormValues) => {
  const payload = {
    ...values,
    module_id: GenericMasterModuleType.Accessories,
  }

  if (editItem) {
    await api.patch(`/generic-masters/${editItem.master_id}`, payload)
  } else {
    await api.post('/generic-masters', payload)
  }

  setOpen(false)
  refresh()
}

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Manage Accessories
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="font-medium">Name</label>
            <Input
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-red-500">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="font-medium">Description</label>
            <Input
              {...register('description')}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Submit'}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}
