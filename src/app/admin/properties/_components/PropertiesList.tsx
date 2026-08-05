import { Property } from "@/modules/properties/types/property";
import { PropertyStatus } from "@/modules/properties/types/enums";
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
import { PropertyRowActions } from "./PropertyRowActions";

interface PropertiesListProps {
  properties: Property[];
  buildersMap: Record<string, Builder>;
}

export function PropertiesList({ properties, buildersMap }: PropertiesListProps) {
  if (!properties || properties.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center border rounded-lg bg-card shadow-sm">
        <h3 className="mt-4 text-lg font-semibold">No properties found</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Adjust your filters or add a new property.
        </p>
      </div>
    );
  }

  const formatPrice = (price: number | null, currency: string | null) => {
    if (!price) return "Price on request";
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const getStatusBadgeVariant = (status: PropertyStatus) => {
    switch (status) {
      case PropertyStatus.ACTIVE: return "default";
      case PropertyStatus.INACTIVE: return "secondary";
      case PropertyStatus.SOLD: return "destructive";
      case PropertyStatus.UPCOMING: return "outline";
      default: return "secondary";
    }
  };

  return (
    <>
      {/* Mobile view: Cards */}
      <div className="grid gap-4 md:hidden">
        {properties.map((property) => (
          <Card key={property.id}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-base truncate">{property.title}</CardTitle>
                <CardDescription className="truncate">{property.propertyCode}</CardDescription>
              </div>
              <PropertyRowActions propertyId={property.id} status={property.status} />
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant={getStatusBadgeVariant(property.status)}>
                  {property.status}
                </Badge>
                {property.isFeatured && (
                  <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">
                    Featured
                  </Badge>
                )}
                <Badge variant="outline">{property.propertyType}</Badge>
              </div>
              <div className="text-sm text-muted-foreground grid grid-cols-1 gap-y-1">
                <span><span className="font-medium text-foreground">Builder:</span> {buildersMap[property.builderId]?.name || "Unknown"}</span>
                <span><span className="font-medium text-foreground">Price:</span> {formatPrice(property.price, property.currency)}</span>
                <span><span className="font-medium text-foreground">Date:</span> {new Date(property.createdAt).toLocaleDateString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Desktop view: Table */}
      <div className="hidden md:block rounded-md border bg-card shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Property Code</TableHead>
              <TableHead className="w-[300px]">Title</TableHead>
              <TableHead>Builder</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {properties.map((property) => (
              <TableRow key={property.id}>
                <TableCell className="font-medium">{property.propertyCode}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-semibold truncate max-w-[280px]">{property.title}</span>
                    <span className="text-xs text-muted-foreground">{property.address || "Location specified"}</span>
                  </div>
                </TableCell>
                <TableCell className="max-w-[150px] truncate" title={buildersMap[property.builderId]?.name}>
                  {buildersMap[property.builderId]?.name || "Unknown"}
                </TableCell>
                <TableCell>{property.propertyType}</TableCell>
                <TableCell>{formatPrice(property.price, property.currency)}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1 items-start">
                    <Badge variant={getStatusBadgeVariant(property.status)}>
                      {property.status}
                    </Badge>
                    {property.isFeatured && (
                      <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 text-[10px] px-1 h-4">
                        Featured
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <PropertyRowActions propertyId={property.id} status={property.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
