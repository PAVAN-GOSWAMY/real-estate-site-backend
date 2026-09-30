import * as React from "react";
import Image from "next/image";
import { Author } from "@/types";

interface AuthorCardProps {
  author: Author;
}

export function AuthorCard({ author }: AuthorCardProps) {
  return (
    <div className="bg-accent/5 p-8 rounded-3xl border border-border/40 mt-12 flex flex-col md:flex-row items-center md:items-start gap-6">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md shrink-0">
        <Image src={author.avatar} alt={author.name} fill className="object-cover" />
      </div>
      <div className="text-center">
        <h4 className="text-xl font-heading font-bold text-foreground mb-1">{author.name}</h4>
        <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-4">{author.designation}</p>
        <p className="text-muted-foreground leading-relaxed">{author.bio}</p>
      </div>
    </div>
  );
}
