'use server'

import { prisma } from "@/lib/prisma"

export async function saveSubscriber(appId: string, subscription: any) {
    try {
        // Check if already exists to avoid duplicates
        const existing = await prisma.subscriber.findFirst({
            where: {
                app_id: appId,
                endpoint: subscription.endpoint
            }
        })

        if (existing) {
            return { success: true }
        }

        await prisma.subscriber.create({
            data: {
                app_id: appId,
                endpoint: subscription.endpoint,
                keys_auth: subscription.keys.auth,
                keys_p256dh: subscription.keys.p256dh,
            }
        })
        return { success: true }
    } catch (error) {
        console.error('Failed to save subscriber', error)
        return { success: false, error: 'Failed to save subscriber' }
    }
}
