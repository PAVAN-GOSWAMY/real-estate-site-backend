"use client";

import { PropertyDocument } from "@/modules/properties/types/assets";
import Image from "next/image";
import { MoreHorizontal, FileText, Trash2, Download, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DocumentCardProps {
  document: PropertyDocument;
  onReplace: (doc: PropertyDocument) => void;
  onDelete: (id: string) => void;
  disabled?: boolean;
}

function formatBytes(bytes: number | null, decimals = 2) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function DocumentCard({ document, onReplace, onDelete, disabled }: DocumentCardProps) {
  const isImage = document.fileUrl.match(/\.(jpeg|jpg|gif|png|webp)$/i) != null;
  
  const handleDownload = () => {
    // Open in new tab which will download or display the PDF/Image natively
    window.open(document.fileUrl, '_blank');
  };

  return (
    <div className="group flex items-center justify-between p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md">
      
      <div className="flex items-center gap-4 overflow-hidden">
        {/* Icon / Thumbnail */}
        <div className="h-12 w-12 shrink-0 rounded-md bg-primary/10 flex items-center justify-center border border-primary/20">
          {isImage ? (
            <div className="relative h-full w-full">
              <Image src={document.fileUrl} alt="Preview" fill sizes="48px" className="object-cover rounded-md" />
            </div>
          ) : (
            <FileText className="h-6 w-6 text-primary" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col overflow-hidden">
          <h4 className="font-semibold text-sm truncate" title={document.name}>
            {document.name}
          </h4>
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <span className="bg-muted px-1.5 py-0.5 rounded text-[10px] font-medium text-foreground tracking-wide uppercase">
              {document.documentType}
            </span>
            <span>&bull;</span>
            <span>{formatBytes(document.fileSize)}</span>
            <span>&bull;</span>
            <span>v{document.version}</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pl-4 shrink-0">
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={disabled} className="hidden sm:flex">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" disabled={disabled}>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={handleDownload} className="cursor-pointer sm:hidden">
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onReplace(document)} className="cursor-pointer">
              <RefreshCw className="mr-2 h-4 w-4" />
              Replace File
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(document.id)} className="text-destructive focus:bg-destructive/10 cursor-pointer">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

    </div>
  );
}
