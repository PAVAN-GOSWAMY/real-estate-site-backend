"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function LeadsFilters({ initialFilters }: { initialFilters: any }) {
  const [search, setSearch] = useState(initialFilters.search || "");
  const [status, setStatus] = useState(initialFilters.status || "all");
  const [source, setSource] = useState(initialFilters.source || "all");

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (status !== "all") params.set("status", status);
    if (source !== "all") params.set("source", source);
    // Navigate using next/navigation
    window.location.href = `/admin/leads?${params.toString()}`;
  };

  return (
    <div className="flex flex-wrap gap-4 items-center mb-4">
      <Input
        placeholder="Search by name, email, phone"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64"
      />
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="New">New</SelectItem>
          <SelectItem value="Contacted">Contacted</SelectItem>
          <SelectItem value="Site Visit Scheduled">Site Visit</SelectItem>
          <SelectItem value="Negotiation">Negotiation</SelectItem>
          <SelectItem value="Won">Won</SelectItem>
          <SelectItem value="Lost">Lost</SelectItem>
        </SelectContent>
      </Select>
      <Select value={source} onValueChange={setSource}>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Source" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sources</SelectItem>
          <SelectItem value="Property Inquiry">Property Inquiry</SelectItem>
          <SelectItem value="General Contact">General Contact</SelectItem>
          {/* Add more sources as needed */}
        </SelectContent>
      </Select>
      <Button onClick={applyFilters} className="flex items-center">
        <Search className="mr-2 h-4 w-4" /> Filter
      </Button>
    </div>
  );
}
