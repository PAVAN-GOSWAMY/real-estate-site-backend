import { Container } from "@/components/layout/wrappers";
import { FeedbackForm } from "@/components/testimonials/FeedbackForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Share Your Experience | Square AR",
  description: "Share your feedback and experience with Square AR. We value your input and strive to improve our services.",
};

export default function FeedbackPage() {
  return (
    <div className="bg-brand-surface py-20 min-h-screen">
      <Container>
        <FeedbackForm />
      </Container>
    </div>
  );
}
