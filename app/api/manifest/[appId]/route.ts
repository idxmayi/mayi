import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { appId: string } }
) {
  const appId = params.appId;

  try {
    const app = await prisma.app.findUnique({
      where: { id: appId },
    });

    if (!app) {
      return new NextResponse("App not found", { status: 404 });
    }

    const manifest = {
      name: app.name,
      short_name: app.name,
      description: app.description || "",
      start_url: `/view/${app.id}`, 
      display: "standalone",
      background_color: "#ffffff",
      theme_color: app.theme_color || "#000000",
      icons: [
        {
          src: app.icon_url || "https://placehold.co/192x192.png", 
          sizes: "192x192",
          type: "image/png",
        },
        {
          src: app.icon_url || "https://placehold.co/512x512.png",
          sizes: "512x512",
          type: "image/png",
        },
      ],
    };

    return NextResponse.json(manifest);
  } catch (error) {
    console.error(error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
