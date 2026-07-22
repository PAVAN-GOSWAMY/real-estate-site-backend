"use client";

import { useState, useTransition, useRef, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PropertyDocument, DocumentType, CreatePropertyDocumentSchema } from "@/modules/properties/types/assets";
import { getDocumentsAction, uploadDocumentAction, replaceDocumentAction, deleteDocumentAction } from "@/modules/properties/actions/assets.actions";
import { DocumentCard } from "./assets/DocumentCard";
import { UploadCloud, Plus, Loader2, Search, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentsTabProps {
  propertyId: string;
}

export function DocumentsTab({ propertyId }: DocumentsTabProps) {
  const [documents, setDocuments] = useState<PropertyDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  // Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    documentType: "",
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const result = await getDocumentsAction(propertyId);
      if (result.success) {
        setDocuments(result.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propertyId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setReplacingId(null);
    setFormData({ name: "", documentType: "" });
    setSelectedFile(null);
  };

  const handleOpenReplace = (doc: PropertyDocument) => {
    setReplacingId(doc.id);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setReplacingId(null);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Immediate upload trigger when a replacement file is selected
  useEffect(() => {
    if (replacingId && selectedFile) {
      startTransition(async () => {
        const payload = new FormData();
        payload.append("propertyId", propertyId);
        payload.append("documentId", replacingId);
        payload.append("file", selectedFile);
        
        const result = await replaceDocumentAction(payload);
        if (result.success) {
          showToast("Document replaced successfully.");
          fetchDocuments();
        } else {
          alert(result.error);
        }
        handleCloseForm();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replacingId, selectedFile]);

  const handleSubmitNew = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("A file is required.");
      return;
    }

    const parsed = CreatePropertyDocumentSchema.safeParse(formData);
    if (!parsed.success) {
      alert(parsed.error.issues[0].message);
      return;
    }

    startTransition(async () => {
      const payload = new FormData();
      payload.append("propertyId", propertyId);
      payload.append("name", parsed.data.name);
      payload.append("documentType", parsed.data.documentType);
      payload.append("file", selectedFile);

      const result = await uploadDocumentAction(payload);
      if (result.success) {
        showToast("Document uploaded successfully.");
        handleCloseForm();
        fetchDocuments();
      } else {
        alert(result.error);
      }
    });
  };

  const handleDelete = (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;

    startTransition(async () => {
      const result = await deleteDocumentAction(propertyId, id);
      if (result.success) {
        showToast("Document deleted.");
        fetchDocuments();
      } else {
        alert(result.error);
      }
    });
  };

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter && typeFilter !== "ALL" ? doc.documentType === typeFilter : true;
      return matchesSearch && matchesType;
    });
  }, [documents, searchQuery, typeFilter]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">Documents</h3>
            <p className="text-sm text-muted-foreground">Manage brochures, legal approvals, and layouts.</p>
          </div>
          
          <div className="flex w-full sm:w-auto items-center gap-3">
            {!isFormOpen && (
              <>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search documents..." 
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Select value={typeFilter || "ALL"} onValueChange={val => setTypeFilter(val)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    {Object.values(DocumentType).map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button onClick={handleOpenForm} disabled={isPending}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Hidden File Input for Replacement Flow */}
        <input
          type="file"
          accept=".pdf,.doc,.docx,.xls,.xlsx,image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setSelectedFile(e.target.files[0]);
            }
          }}
        />

        {/* Form Modal/Inline */}
        {isFormOpen && !replacingId && (
          <Card className="border-primary/50 shadow-md">
            <form onSubmit={handleSubmitNew}>
              <CardHeader>
                <CardTitle>Upload New Document</CardTitle>
                <CardDescription>Max file size 25MB. PDF, DOCX, XLSX, Images supported.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Document Name <span className="text-destructive">*</span></Label>
                    <Input id="name" required placeholder="e.g. Master Plan Q3" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type <span className="text-destructive">*</span></Label>
                    <Select value={formData.documentType} onValueChange={val => setFormData({ ...formData, documentType: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select type..." />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(DocumentType).map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2 mt-4">
                  <Label>File <span className="text-destructive">*</span></Label>
                  <div 
                    className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg transition-colors ${
                      isDraggingOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:bg-muted/50'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true); }}
                    onDragLeave={(e) => { e.preventDefault(); setIsDraggingOver(false); }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setIsDraggingOver(false);
                      const files = e.dataTransfer.files;
                      if (files && files.length > 0) setSelectedFile(files[0]);
                    }}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedFile ? (
                      <div className="text-center">
                        <p className="font-medium text-primary">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                        <Button type="button" variant="link" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}>Remove</Button>
                      </div>
                    ) : (
                      <>
                        <div className="rounded-full bg-primary/10 p-3 mb-2">
                          <UploadCloud className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">Click or drag file here</p>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
              <CardContent className="flex justify-end gap-3 pt-0">
                <Button type="button" variant="outline" onClick={handleCloseForm} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                  {isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Upload Document
                </Button>
              </CardContent>
            </form>
          </Card>
        )}

        {/* List */}
        {!isFormOpen && (
          filteredDocs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <DocumentCard 
                  key={doc.id}
                  document={doc}
                  onReplace={handleOpenReplace}
                  onDelete={handleDelete}
                  disabled={isPending}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="rounded-full bg-muted p-4 mb-4">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">No documents found</h3>
                <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-sm">
                  {searchQuery || (typeFilter && typeFilter !== 'ALL') 
                    ? "Try adjusting your search or filters." 
                    : "Upload brochures, payment plans, and legal documents here."}
                </p>
                <Button onClick={handleOpenForm} disabled={isPending}>
                  <Plus className="w-4 h-4 mr-2" />
                  Upload First Document
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 rounded-md bg-zinc-900 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all animate-in fade-in slide-in-from-bottom-4">
          {toastMessage}
        </div>
      )}
    </>
  );
}
