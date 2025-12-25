'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/utils/api'
import { GenericMaster } from '@/types/GenericMaster'
import AccessoryForm from '@/app/form/AccessoryForm'
import Loader from '@/components/ui/Loader'


export default function EditAccessoryPage() {
  const { id } = useParams()
  const router = useRouter()

  const [data, setData] = useState<GenericMaster | null>(null)

  useEffect(() => {
    api.get(`/generic-masters/${id}`).then(res => {
      setData(res.data)
    })
  }, [id])

  if (!data) return (
      <Loader  />
  )
  console.log('EDIT PAGE MOUNTED')


  return (
  <div className=" min-h-screen flex items-center justify-center ">
  <div className="w-full  max-w-sm p-6 border rounded-lg shadow-md mt-10 gap-3">
    
    <h1 className="text-2xl font-bold mt-6 text-center ">
      Manage Accessories
    </h1>
    <div className="mt-9  ">
    <AccessoryForm
      editItem={data}
      onSuccess={() => router.push('/')}  
      onCancel={() => router.push('/')}
    />
    </div>
    
  </div>
</div>

  )
}
