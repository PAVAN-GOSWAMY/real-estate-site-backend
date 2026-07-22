import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Building2, Calendar, Trophy, ArrowRight } from "lucide-react";

interface DeveloperProfile {
  name: string;
  logo: string | null;
  experience: string;
  delivered: string;
  description: string;
}

interface PropertyDeveloperProps {
  profile: DeveloperProfile;
}

export function PropertyDeveloper({ profile }: PropertyDeveloperProps) {
  if (!profile) return null;

  return (
    <div className="space-y-6">
      <h3 className="font-heading text-3xl font-bold text-foreground">About the Builder</h3>
      
      <div className="bg-card rounded-[2rem] p-6 md:p-8 border border-border/50 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-8 items-start">
          
          <div className="relative h-32 w-32 sm:h-40 sm:w-40 shrink-0 bg-surface/50 rounded-[1.5rem] border border-border/50 p-4 flex items-center justify-center">
            {profile.logo && profile.logo.trim() !== "" ? (
              <Image 
                src={profile.logo} 
                alt={profile.name} 
                fill 
                className="object-contain p-4"
              />
            ) : (
              <div className="flex items-center justify-center h-full w-full bg-muted/20 rounded-xl">
                <Building2 className="h-12 w-12 text-muted-foreground/30" />
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-6 w-full">
            <div>
              <h4 className="font-heading text-2xl font-bold text-foreground mb-3">{profile.name}</h4>
              {profile.description && (
                <p className="text-muted-foreground text-sm leading-relaxed max-w-3xl">{profile.description}</p>
              )}
            </div>
            
            <div className="flex flex-wrap gap-x-12 gap-y-6 py-6 border-y border-border/40">
              <div className="flex items-start gap-3">
                <Calendar className="h-6 w-6 text-muted-foreground/30 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Experience</p>
                  <p className="font-semibold text-foreground text-base">{profile.experience}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Trophy className="h-6 w-6 text-muted-foreground/30 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Delivered</p>
                  <p className="font-semibold text-foreground text-base">{profile.delivered}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-6 w-6 text-muted-foreground/30 shrink-0 mt-0.5" strokeWidth={1.5} />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                  <p className="font-semibold text-foreground text-base">Premium Builder</p>
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <Link href={`/builders/${profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}`}>
                <Button variant="link" className="text-muted-foreground/70 hover:text-foreground p-0 h-auto font-medium transition-colors">
                  View All Projects by {profile.name} <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
