'use server'

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const CreateAppSchema = z.object({
  name: z.string().min(1, "Name is required"),
  target_url: z.string().url("Must be a valid URL"),
  icon_url: z.string().optional(),
  theme_color: z.string().optional(),
  user_id: z.string(), 
})

export async function createApp(prevState: any, formData: FormData) {
  const rawData = {
    name: formData.get('name'),
    target_url: formData.get('target_url'),
    icon_url: formData.get('icon_url'),
    theme_color: formData.get('theme_color'),
    user_id: formData.get('user_id'),
  }

  const validatedFields = CreateAppSchema.safeParse(rawData)

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Missing Fields. Failed to Create App.',
    }
  }

  try {
    await prisma.app.create({
      data: {
        name: validatedFields.data.name,
        target_url: validatedFields.data.target_url,
        icon_url: validatedFields.data.icon_url || '',
        theme_color: validatedFields.data.theme_color || '#000000',
        user_id: validatedFields.data.user_id,
      },
    })
    revalidatePath('/dashboard')
    return { success: true, message: 'App Created Successfully' }
  } catch (error) {
    return { message: 'Database Error: Failed to Create App.' }
  }
}

export async function getApps(userId: string) {
  try {
    const apps = await prisma.app.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'desc' },
    })
    return apps
  } catch (error) {
    throw new Error('Failed to fetch apps.')
  }
}

export async function getApp(appId: string) {
    try {
        const app = await prisma.app.findUnique({
            where: { id: appId }
        })
        return app
    } catch (error) {
        throw new Error('Failed to fetch app.')
    }
}
