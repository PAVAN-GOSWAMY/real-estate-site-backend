import Link from "next/link";
import { notFound } from "next/navigation";
import { Edit, ChevronLeft, Globe, MapPin, Calendar, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getBuilderAction } from "@/modules/builders/actions";
import { DeactivateButton } from "./_components/deactivate-button";

// Next.js config to ensure dynamic path segment is awaited correctly
export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function BuilderDetailsPage(props: PageProps) {
  const params = await props.params;
  const result = await getBuilderAction(params.id);

  if (!result.success || !result.data) {
    notFound();
  }

  const builder = result.data;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Quick Actions / Breadcrumb level */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Button variant="ghost" className="w-fit -ml-4 text-muted-foreground" asChild>
          <Link href="/admin/builders">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Builders
          </Link>
        </Button>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" asChild>
            <Link href={`/admin/builders/${builder.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Builder
            </Link>
          </Button>
          {builder.isActive && <DeactivateButton builderId={builder.id} />}
        </div>
      </div>

      {/* Header Profile */}
      <div className="flex flex-col sm:flex-row items-start gap-6 pb-6 border-b">
        <Avatar className="h-24 w-24 rounded-lg border-2 border-muted shadow-sm">
          <AvatarImage src={builder.logoUrl || ""} alt={builder.name} className="object-cover" />
          <AvatarFallback className="rounded-lg text-3xl font-semibold bg-primary/5 text-primary">
            {builder.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight">{builder.name}</h1>
            <div className="flex items-center gap-2">
              <Badge variant={builder.isActive ? "default" : "secondary"}>
                {builder.isActive ? "Active" : "Inactive"}
              </Badge>
              {builder.isFeatured && (
                <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                  Featured
                </Badge>
              )}
            </div>
          </div>
          <p className="text-muted-foreground font-mono text-sm">{builder.slug}</p>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">About</h3>
        {builder.description ? (
          <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap max-w-4xl">
            {builder.description}
          </p>
        ) : (
          <p className="text-muted-foreground italic">No description provided.</p>
        )}
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Company contact details and origin.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-[24px_1fr] items-center gap-4 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>{builder.headquarters || "Not specified"}</span>
              
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{builder.establishedYear || "Not specified"}</span>
              
              <Globe className="h-4 w-4 text-muted-foreground" />
              {builder.website ? (
                <a href={builder.website} target="_blank" rel="noreferrer" className="text-primary hover:underline transition-colors">
                  {builder.website}
                </a>
              ) : (
                <span className="text-muted-foreground">Not specified</span>
              )}
              
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{builder.email || "Not specified"}</span>
              
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{builder.phone || "Not specified"}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Metadata</CardTitle>
            <CardDescription>System records and identifiers.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex flex-col space-y-1">
              <span className="text-muted-foreground text-xs">Builder ID</span>
              <span className="font-mono text-xs bg-muted p-2 rounded-md break-all">{builder.id}</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-xs">Created At</span>
                <span>{new Date(builder.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex flex-col space-y-1">
                <span className="text-muted-foreground text-xs">Last Updated</span>
                <span>{new Date(builder.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Future Placeholder Sections */}
      <div className="space-y-4 pt-6 border-t">
        <h3 className="text-lg font-semibold">Linked Resources</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: "Projects (0)" },
            { title: "Properties (0)" },
            { title: "Leads (0)" },
            { title: "Analytics" },
          ].map((item) => (
            <Card key={item.title} className="opacity-60 bg-muted/30 border-dashed">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="font-normal text-xs">Coming Soon</Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
