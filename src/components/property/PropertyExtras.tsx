import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

import { PropertyDocument } from "@/modules/properties/types/assets";

interface PropertyDocumentsProps {
  documents: PropertyDocument[];
}

export function PropertyDocuments({ documents }: PropertyDocumentsProps) {
  if (!documents || documents.length === 0) return null;

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-2xl font-bold text-primary">Project Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc) => (
          <div key={doc.id} className="bg-primary/5 rounded-2xl p-6 border border-primary/10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{doc.name}</h4>
                <p className="text-sm text-muted-foreground">{doc.documentType}</p>
              </div>
            </div>
            <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
              <Button className="shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PropertyDisclaimer() {
  return (
    <div className="text-xs text-muted-foreground/70 leading-relaxed border-t border-border/50 pt-8 mt-12 pb-8">
      <p className="mb-2"><strong>Disclaimer:</strong> The content provided on this page, including but not limited to project details, pricing, floor plans, and amenities, is for informational purposes only. While we strive to ensure accuracy, the developer reserves the right to make modifications to the project specifications without prior notice.</p>
      <p>Pricing mentioned is indicative and subject to change. The images shown may be artistic impressions or stock photography meant for representation purposes only. We advise buyers to verify all details independently with the developer and review the RERA registration before making any purchasing decisions. {siteConfig.name} acts solely as an advisory consultant.</p>
    </div>
  );
}
