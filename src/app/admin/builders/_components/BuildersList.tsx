import { Builder } from "@/modules/builders/types/builder";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BuilderRowActions } from "./BuilderRowActions";

interface BuildersListProps {
  builders: Builder[];
}

export function BuildersList({ builders }: BuildersListProps) {
  if (!builders || builders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
        <h3 className="mt-4 text-lg font-semibold">No builders found</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Adjust your filters or create a new builder.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile view: Cards */}
      <div className="grid gap-4 sm:hidden">
        {builders.map((builder) => (
          <Card key={builder.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={builder.logoUrl || ""} alt={builder.name} />
                  <AvatarFallback>{builder.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <CardTitle className="text-base truncate">{builder.name}</CardTitle>
                  <CardDescription className="truncate">{builder.slug}</CardDescription>
                </div>
              </div>
              <BuilderRowActions builderId={builder.id} isActive={builder.isActive} />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-2">
                <Badge variant={builder.isActive ? "default" : "secondary"}>
                  {builder.isActive ? "Active" : "Inactive"}
                </Badge>
                {builder.isFeatured && (
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                    Featured
                  </Badge>
                )}
              </div>
              <div className="text-sm text-muted-foreground grid grid-cols-2 gap-y-1">
                <span>HQ: {builder.headquarters || "N/A"}</span>
                <span>Est: {builder.establishedYear || "N/A"}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden sm:block rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Builder</TableHead>
              <TableHead>Headquarters</TableHead>
              <TableHead>Est. Year</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {builders.map((builder) => (
              <TableRow key={builder.id} data-testid={`builder-row-${builder.id}`}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3" data-testid="builder-name">
                    <Avatar>
                      <AvatarImage src={builder.logoUrl || ""} alt={builder.name} />
                      <AvatarFallback>{builder.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col max-w-[200px] sm:max-w-[250px]">
                      <span className="font-semibold truncate">{builder.name}</span>
                      <span className="text-xs text-muted-foreground font-normal truncate">{builder.slug}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{builder.headquarters || "-"}</TableCell>
                <TableCell>{builder.establishedYear || "-"}</TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell className="text-right">
                  <BuilderRowActions builderId={builder.id} isActive={builder.isActive} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
