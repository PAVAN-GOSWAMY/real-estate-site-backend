import { CheckCircle2, ShieldCheck, UserCheck, IndianRupee } from "lucide-react";
import { Section, Container, SectionHeader, SectionTitle, SectionDescription } from "@/components/layout/wrappers";

export function WhyChooseUs() {
  const features = [
    {
      id: "f1",
      icon: <CheckCircle2 className="w-8 h-8 text-primary" />,
      title: "Verified Properties",
      description: "Every property goes through a rigorous legal and physical verification process to ensure zero disputes."
    },
    {
      id: "f2",
      icon: <ShieldCheck className="w-8 h-8 text-primary" />,
      title: "Trusted Developers",
      description: "We partner exclusively with RERA-registered developers who have a proven track record of timely delivery."
    },
    {
      id: "f3",
      icon: <UserCheck className="w-8 h-8 text-primary" />,
      title: "Expert Guidance",
      description: "Our dedicated property advisors provide personalized end-to-end support for your real estate journey."
    },
    {
      id: "f4",
      icon: <IndianRupee className="w-8 h-8 text-primary" />,
      title: "Transparent Pricing",
      description: "No hidden charges, no surprises. We believe in complete financial transparency from day one."
    }
  ];

  return (
    <Section className="bg-surface pt-16 pb-16">
      <Container>
        <SectionHeader className="text-center md:max-w-3xl mx-auto">
          <SectionTitle>Why Choose Square AR Spaces</SectionTitle>
          <SectionDescription>
            We bring transparency, trust, and expertise to your real estate investments, making the process of buying a property seamless and secure.
          </SectionDescription>
        </SectionHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {features.map((feature) => (
            <div 
              key={feature.id}
              className="bg-card rounded-2xl p-8 border border-border/50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 group flex flex-col items-start h-full"
            >
              <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed flex-1">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
