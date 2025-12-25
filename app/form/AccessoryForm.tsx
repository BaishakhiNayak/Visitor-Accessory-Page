'use client'

import { useEffect } from 'react'
import api from '@/utils/api'
import { GenericMaster } from '@/types/GenericMaster'
import { GenericMasterModuleType } from '@/constants/GenericMasterModuleType'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'react-toastify'

import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import Loader from '@/components/ui/Loader'

type FormValues = {
  name: string
  description?: string | null
}

type Props = {
  editItem?: GenericMaster | null
  onSuccess: () => void
  onCancel: () => void
}

const schema = yup.object({
  name: yup.string().required('Name is required'),
})

export default function AccessoryForm({
  editItem,
  onSuccess,
  onCancel,
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
    try {
      const payload = {
        ...values,
        module_id: GenericMasterModuleType.Accessories,
      }

      if (editItem) {
        await api.patch(`/generic-masters/${editItem.master_id}`, payload)
        toast.success('Accessory updated')
      } else {
        await api.post('/generic-masters', payload)
        toast.success('Accessory added')
      }

      onSuccess()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="font-medium">Name</label>
        <Input {...register('name')} />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="font-medium">Description</label>
        <Input {...register('description')} />
      </div>

      <div className="flex justify-end gap-3">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Submit'}
        </Button>
      </div>
    </form>
  )
}
