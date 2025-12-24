'use server'

import { prisma } from "@/lib/prisma"
import webpush from "web-push"

// In a real app, these should be set in environment variables
if (process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      'mailto:test@example.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    )
}

export async function sendNotification(appId: string, title: string, body: string, url: string) {
    const subscribers = await prisma.subscriber.findMany({
        where: { app_id: appId }
    })

    const payload = JSON.stringify({ 
        title, 
        body, 
        url,
        icon: '/icon.png' // Default icon or from app details
    })

    const results = await Promise.allSettled(subscribers.map(sub => {
        const pushSubscription = {
            endpoint: sub.endpoint,
            keys: {
                auth: sub.keys_auth,
                p256dh: sub.keys_p256dh
            }
        }
        return webpush.sendNotification(pushSubscription, payload)
    }))

    const sentCount = results.filter(r => r.status === 'fulfilled').length
    const failedCount = results.filter(r => r.status === 'rejected').length

    return { 
        success: true, 
        sent_count: sentCount,
        failed_count: failedCount
    }
}
