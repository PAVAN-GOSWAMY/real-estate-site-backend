"use client";

import { Location } from "@/modules/locations/types";
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
import { LocationsRowActions } from "./LocationsRowActions";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface LocationsTableProps {
  locations: (Location & { city?: { name: string }, properties?: [{ count: number }] })[];
  total: number;
  currentPage: number;
  pageSize: number;
}

export function LocationsTable({ locations, total, currentPage, pageSize }: LocationsTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const totalPages = Math.ceil(total / pageSize) || 1;

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  if (!locations || locations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border rounded-lg bg-card">
        <h3 className="mt-4 text-lg font-semibold">No locations found</h3>
        <p className="mb-4 text-sm text-muted-foreground">
          Adjust your filters or create a new location.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Location</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((loc) => (
              <TableRow key={loc.id}>
                <TableCell className="font-medium">
                  <div className="flex flex-col max-w-[200px] sm:max-w-[250px]">
                    <span className="font-semibold truncate">{loc.name}</span>
                    <span className="text-xs text-muted-foreground font-normal truncate">{loc.slug}</span>
                  </div>
                </TableCell>
                <TableCell>{loc.city?.name || '-'}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal text-xs">{loc.type}</Badge>
                </TableCell>
                <TableCell>{loc.properties?.[0]?.count || 0}</TableCell>
                <TableCell>
                  <Badge variant={loc.is_active ? "default" : "secondary"}>
                    {loc.is_active ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <LocationsRowActions locationId={loc.id} isActive={loc.is_active} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">
          Showing {Math.min((currentPage - 1) * pageSize + 1, total)} to{" "}
          {Math.min(currentPage * pageSize, total)} of {total} locations
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  );
}
