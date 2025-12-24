import { getApps } from "@/actions/app";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import CreateAppForm from "@/components/create-app-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export default async function Dashboard() {
  // Mock user ID for now
  const userId = "demo-user-id"; 
  const apps = await getApps(userId);

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Apps</h1>
        
        <Dialog>
            <DialogTrigger asChild>
                <Button><Plus className="mr-2 h-4 w-4" /> Create App</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New App</DialogTitle>
                    <DialogDescription>
                        Enter the details for your new PWA wrapper.
                    </DialogDescription>
                </DialogHeader>
                <CreateAppForm userId={userId} />
            </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.length === 0 ? (
            <p className="text-muted-foreground col-span-full text-center py-10">No apps found. Create your first one!</p>
        ) : (
            apps.map((app) => (
            <Link key={app.id} href={`/dashboard/${app.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer h-full">
                <CardHeader>
                    <div className="flex items-center space-x-4">
                        {app.icon_url && <img src={app.icon_url} alt={app.name} className="w-10 h-10 rounded-full object-cover" />}
                        <div>
                            <CardTitle>{app.name}</CardTitle>
                            <CardDescription className="truncate max-w-[200px]">{app.target_url}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        Theme: <span className="inline-block w-3 h-3 rounded-full ml-1" style={{ backgroundColor: app.theme_color || '#000' }}></span>
                    </div>
                </CardContent>
                </Card>
            </Link>
            ))
        )}
      </div>
    </div>
  );
}
