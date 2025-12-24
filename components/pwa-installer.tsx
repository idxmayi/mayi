'use client'

import { saveSubscriber } from "@/actions/subscriber"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Bell, Download } from "lucide-react"

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

export default function PwaInstaller({ appId, vapidKey }: { appId: string, vapidKey: string }) {
    const [isSupported, setIsSupported] = useState(false)
    const [subscription, setSubscription] = useState<PushSubscription | null>(null)
    const [installPrompt, setInstallPrompt] = useState<any>(null)
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        if ('serviceWorker' in navigator && 'PushManager' in window) {
            setIsSupported(true)
            registerServiceWorker()
        }

        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault()
            setInstallPrompt(e)
        })
    }, [])

    async function registerServiceWorker() {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/',
                updateViaCache: 'none',
            })
            
            // Check if already subscribed
            const existingSubscription = await registration.pushManager.getSubscription()
            if (existingSubscription) {
                setSubscription(existingSubscription)
                setIsSubscribed(true)
                // Optionally update on server just in case
                await saveSubscriber(appId, JSON.parse(JSON.stringify(existingSubscription)))
            }
        } catch (error) {
            console.error('Service Worker registration failed:', error)
        }
    }

    async function subscribeToPush() {
        try {
            const registration = await navigator.serviceWorker.ready
            const sub = await registration.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(vapidKey),
            })
            
            setSubscription(sub)
            setIsSubscribed(true)
            await saveSubscriber(appId, JSON.parse(JSON.stringify(sub)))
            alert('Subscribed to notifications!')
        } catch (error) {
            console.error('Failed to subscribe:', error)
            alert('Failed to subscribe to notifications.')
        }
    }

    async function installApp() {
        if (!installPrompt) {
            return
        }
        installPrompt.prompt()
        const { outcome } = await installPrompt.userChoice
        if (outcome === 'accepted') {
            setInstallPrompt(null)
        }
    }

    if (!isSupported) {
        return <div>Push notifications are not supported on this browser.</div>
    }

    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            {installPrompt && (
                <Button onClick={installApp} className="w-full" size="lg">
                    <Download className="mr-2 h-4 w-4" /> Install App
                </Button>
            )}

            {!isSubscribed ? (
                 <Button onClick={subscribeToPush} variant="secondary" className="w-full" size="lg">
                    <Bell className="mr-2 h-4 w-4" /> Enable Notifications
                </Button>
            ) : (
                <p className="text-center text-sm text-muted-foreground">
                    <Bell className="inline-block mr-1 h-3 w-3" /> Notifications Enabled
                </p>
            )}
        </div>
    )
}
