'use client'

import { sendNotification } from "@/actions/push"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useFormStatus } from "react-dom"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Sending...' : 'Send Notification'}
    </Button>
  )
}

export default function SendNotificationForm({ appId }: { appId: string }) {
    const [result, setResult] = useState<any>(null)

    async function action(formData: FormData) {
        const title = formData.get('title') as string
        const body = formData.get('body') as string
        const url = formData.get('url') as string
        
        const res = await sendNotification(appId, title, body, url)
        setResult(res)
    }

    return (
        <form action={action} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" placeholder="Special Offer!" required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="body">Message Body</Label>
                <Input id="body" name="body" placeholder="Check out our latest deals..." required />
            </div>

            <div className="space-y-2">
                <Label htmlFor="url">Link URL (Optional)</Label>
                <Input id="url" name="url" placeholder="https://..." />
            </div>

            <SubmitButton />

            {result && (
                <div className={`text-sm p-3 rounded ${result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {result.success 
                        ? `Sent: ${result.sent_count}, Failed: ${result.failed_count}` 
                        : 'Failed to send notification'}
                </div>
            )}
        </form>
    )
}
