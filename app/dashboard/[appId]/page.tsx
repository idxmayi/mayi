import { getApp } from "@/actions/app";
import SendNotificationForm from "@/components/send-notification-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AppDetail({ params }: { params: { appId: string } }) {
  const app = await getApp(params.appId);

  if (!app) {
    return notFound();
  }

  const pwaLink = `${process.env.NEXT_PUBLIC_APP_URL || ''}/view/${app.id}`;

  return (
    <div className="container mx-auto py-10">
      <Link href="/dashboard" className="flex items-center text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>App Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">App Name</label>
                        <p className="text-lg font-semibold">{app.name}</p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">Target URL</label>
                        <p className="text-sm break-all text-blue-500 hover:underline">
                            <a href={app.target_url} target="_blank" rel="noreferrer">{app.target_url}</a>
                        </p>
                    </div>
                    <div>
                        <label className="text-sm font-medium text-muted-foreground">PWA Installation Link</label>
                        <div className="flex items-center gap-2 mt-1">
                             <code className="bg-muted p-2 rounded text-sm flex-1 overflow-x-auto whitespace-nowrap">
                                {pwaLink}
                             </code>
                             <Link href={`/view/${app.id}`} target="_blank">
                                <Button size="sm" variant="outline"><ExternalLink className="h-4 w-4" /></Button>
                             </Link>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Send Push Notification</CardTitle>
                </CardHeader>
                <CardContent>
                    <SendNotificationForm appId={app.id} />
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
