'use client'

import { createApp } from "@/actions/app"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useFormState, useFormStatus } from "react-dom"

const initialState = {
  message: '',
  errors: {}
}

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? 'Creating...' : 'Create App'}
    </Button>
  )
}

export default function CreateAppForm({ userId }: { userId: string }) {
    // @ts-ignore
    const [state, formAction] = useFormState(createApp, initialState)

    return (
        <form action={formAction} className="space-y-4 mt-4">
            <input type="hidden" name="user_id" value={userId} />
            
            <div className="space-y-2">
                <Label htmlFor="name">App Name</Label>
                <Input id="name" name="name" placeholder="My Awesome App" required />
                {state?.errors?.name && <p className="text-red-500 text-sm">{state.errors.name}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="target_url">Target URL</Label>
                <Input id="target_url" name="target_url" placeholder="https://example.com" required />
                {state?.errors?.target_url && <p className="text-red-500 text-sm">{state.errors.target_url}</p>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="icon_url">Icon URL</Label>
                <Input id="icon_url" name="icon_url" placeholder="https://example.com/icon.png" />
            </div>

            <div className="space-y-2">
                <Label htmlFor="theme_color">Theme Color</Label>
                <Input id="theme_color" name="theme_color" type="color" className="h-10 w-20 p-1" defaultValue="#000000" />
            </div>

            <SubmitButton />
            {state?.message && <p className="text-center text-sm">{state.message}</p>}
        </form>
    )
}
