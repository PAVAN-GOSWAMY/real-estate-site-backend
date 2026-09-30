import { PageHeader } from "@/components/admin/ui/PageHeader";
import { TestimonialsService } from "@/modules/testimonials/services/testimonials.service";
import { TestimonialsList } from "./_components/TestimonialsList";
import { TestimonialFormDialog } from "./_components/TestimonialFormDialog";
import { TestimonialSubmissionsList } from "./_components/TestimonialSubmissionsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function TestimonialsPage() {
  const testimonials = await TestimonialsService.getAllTestimonialsAdmin();
  const submissions = await TestimonialsService.getAllSubmissions();

  const pendingSubmissions = submissions.filter(s => s.status === 'pending');
  const rejectedSubmissions = submissions.filter(s => s.status === 'rejected');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Testimonials" description="Manage client testimonials and feedback submissions." />
        <TestimonialFormDialog />
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active">Active ({testimonials.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending Review ({pendingSubmissions.length})</TabsTrigger>
          <TabsTrigger value="rejected">Rejected ({rejectedSubmissions.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          <TestimonialsList testimonials={testimonials} />
        </TabsContent>
        
        <TabsContent value="pending">
          <TestimonialSubmissionsList submissions={pendingSubmissions} />
        </TabsContent>
        
        <TabsContent value="rejected">
          <TestimonialSubmissionsList submissions={rejectedSubmissions} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
