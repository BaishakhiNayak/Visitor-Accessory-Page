'use client'

import { useEffect, useState } from 'react'
import api from '@/utils/api'
import { GenericMaster } from '@/types/GenericMaster'
import { GenericMasterModuleType } from '@/constants/GenericMasterModuleType'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Switch } from '@/components/ui/switch'
import { Pencil, Trash2, Loader2} from 'lucide-react'
import Loader from '@/components/ui/Loader'
import { Button } from '@/components/ui/button'

import AddAccessoryDialog from '../dilogboxes/AddAccessories'
import DeleteConfirmDialog from '../dilogboxes/DeleteDialog'
import StatusDialog from '../dilogboxes/StatusDialog'

import { useRouter } from 'next/navigation'


export default function AccessoriesPage() {

  const router = useRouter();
  
  const [data, setData] = useState<GenericMaster[]>([])
  const [open, setOpen] = useState(false)
  const [editItem, setEditItem] = useState<GenericMaster | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GenericMaster | null>(null)
  const [tempStatus, setTempStatus] = useState<number>(0)
  const [loading, setLoading] = useState(true)


    
   const fetchData = async () => {
    try {
      setLoading(true)

      const res = await api.get('/generic-masters', {
        params: {
          'filter[0]': `module_id||$eq||${GenericMasterModuleType.Accessories}`,
        },
      })

      setData(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const rollbackStatus = () => {
  if (!selectedItem) return

  setData(prev =>
    prev.map(d =>
      d.master_id === selectedItem.master_id
        ? { ...d, status: selectedItem.status }
        : d
    )
  )
  }
  const handleStatusClick = (item: GenericMaster) => {
    setSelectedItem(item)

    const toggledStatus = item.status === 1 ? 0 : 1
    setTempStatus(toggledStatus)

    setData(prev =>
      prev.map(d =>
        d.master_id === item.master_id
          ? { ...d, status: toggledStatus }
          : d
      )
    )

    setStatusDialogOpen(true)
  }

  return (
    <div className="p-9">
      <h1 className="text-2xl font-bold mb-4">Accessories</h1>

      
      <Table>
        <TableHeader className='bg-gray-100'>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Status</TableHead>
            <TableHead ></TableHead>
          </TableRow>
        </TableHeader>
      
        <TableBody> 
          {loading ? (
          <TableRow>
            <TableCell colSpan={4} className="py-10 text-center">
              <Loader />
            </TableCell>
          </TableRow>
          ) : (
          data.map(item => (
            <TableRow key={item.master_id}>
              <TableCell>{item.name}</TableCell>

              <TableCell>
                {item.description ?? '-'}
              </TableCell>

              <TableCell >
                <Switch  checked={item.status === 1}
                onCheckedChange={() => handleStatusClick(item)} />
                <span className="text-sm font-medium">
                {item.status === 1 ? 'Active' : 'Inactive'}
                </span>
              </TableCell>

              <TableCell className="flex justify-end gap-4">
                <Pencil className="w-4 h-4 cursor-pointer"
                 onClick={() =>
                  router.push(`/edit/${item.master_id}`)
                 }
                />
                <Trash2 className="w-4 h-4 cursor-pointer text-red-500" 
                 onClick={() => {
                    setDeleteId(item.master_id)
                    setDeleteOpen(true)
                }}/>
              </TableCell>
            </TableRow>
           ))
       )}  
        </TableBody>
      </Table>
     

      <div className='mt-70 flex justify-end '>
        <Button className='bg-blue-900 flex justify-end  ' onClick={() => {
            setEditItem(null)
            setOpen(true)
          }} >+ Add Accessories</Button>
      </div>


      <StatusDialog
        open={statusDialogOpen}
        setOpen={setStatusDialogOpen}
        item={selectedItem}
        newStatus={tempStatus}
        onCancel={rollbackStatus}
        refresh={fetchData}
      />

      <AddAccessoryDialog
        open={open}
        setOpen={setOpen}
        editItem={editItem}
        refresh={fetchData}
      />

      <DeleteConfirmDialog
        open={deleteOpen}
        setOpen={setDeleteOpen}
        id={deleteId}
        refresh={fetchData}
      />
    </div>

  )
}
