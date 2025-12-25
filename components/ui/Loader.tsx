import { Loader2 } from 'lucide-react'

export default function Loader() {
  return (
    <div className="flex justify-center items-center py-10 bg-black/40 text-white ">
      <Loader2 className="h-6 w-6 animate-spin   " /> Loading...
    </div>
  )
}
