import { Briefcase, FileText, CheckCircle, Mail } from "lucide-react";

interface CareersStatsCardsProps {
  stats: {
    totalJobs: number;
    activeJobs: number;
    totalApplications: number;
    newApplications: number;
  };
}

export function CareersStatsCards({ stats }: CareersStatsCardsProps) {
  const cards = [
    {
      title: "Active Jobs",
      value: stats.activeJobs,
      subtitle: `Out of ${stats.totalJobs} total jobs`,
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "New Applications",
      value: stats.newApplications,
      subtitle: "Awaiting review",
      icon: Mail,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications,
      subtitle: "All time applications",
      icon: FileText,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Hiring Rate",
      value: "N/A", // Placeholder for future enhancement
      subtitle: "Hires vs Applications",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {cards.map((card, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-sm border border-border p-6 flex items-start gap-4">
          <div className={`${card.bgColor} ${card.color} w-12 h-12 rounded-lg flex items-center justify-center shrink-0`}>
            <card.icon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
            <h3 className="text-2xl font-bold text-foreground mt-1">{card.value}</h3>
            <p className="text-xs text-muted-foreground mt-1">{card.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
