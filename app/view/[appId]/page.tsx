import { getApp } from "@/actions/app";
import PwaInstaller from "@/components/pwa-installer";
import { notFound } from "next/navigation";

export default async function ViewApp({ params }: { params: { appId: string } }) {
  const app = await getApp(params.appId);

  if (!app) {
    return notFound();
  }

  // Use a public key from environment variables
  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

  return (
    <>
      <head>
        <link rel="manifest" href={`/api/manifest/${app.id}`} />
        <meta name="theme-color" content={app.theme_color || '#000000'} />
      </head>
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground">
        <div className="flex flex-col items-center space-y-6 text-center">
            {app.icon_url && (
                <img 
                    src={app.icon_url} 
                    alt={app.name} 
                    className="w-24 h-24 rounded-2xl shadow-lg"
                />
            )}
            <h1 className="text-3xl font-bold">{app.name}</h1>
            {app.description && <p className="text-muted-foreground">{app.description}</p>}
            
            <div className="w-full max-w-md space-y-4">
                 <a href={app.target_url} target="_blank" rel="noreferrer" className="block w-full">
                    <button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-md font-medium">
                        Open {app.name}
                    </button>
                 </a>

                 <PwaInstaller appId={app.id} vapidKey={vapidKey} />
            </div>
        </div>
      </div>
    </>
  );
}
