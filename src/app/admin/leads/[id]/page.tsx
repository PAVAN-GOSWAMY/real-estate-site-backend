import { notFound } from "next/navigation";
import { LeadsService } from "@/modules/leads/services/leads.service";
import { LeadNotesService } from "@/modules/leads/services/lead-notes.service";
import { LeadWorkspace } from "./_components/LeadWorkspace";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  let lead;
  
  try {
    lead = await LeadsService.getLeadById(resolvedParams.id);
  } catch (error) {
    notFound();
  }

  // Fetch all related entities for the workspace
  const [activities, notes, followUps, attachments] = await Promise.all([
    LeadsService.getLeadActivities(lead.id),
    LeadNotesService.getLeadNotes(lead.id),
    LeadsService.getLeadFollowUps(lead.id),
    LeadsService.getLeadAttachments(lead.id)
  ]);

  return (
    <LeadWorkspace 
      lead={lead}
      activities={activities}
      notes={notes}
      followUps={followUps}
      attachments={attachments}
    />
  );
}
