export interface Testimonial {
  id: string;
  name: string;
  initials?: string;
  imageUrl?: string;
  rating: number;
  review: string;
  property?: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Rajesh Kumar",
    initials: "RK",
    rating: 5,
    review: "Square AR Spaces made finding our dream home incredibly easy. Their verified properties and transparent pricing gave us complete peace of mind throughout the entire process.",
    property: "Purchased in Sector 150, Noida",
  },
  {
    id: "t2",
    name: "Priya Sharma",
    initials: "PS",
    rating: 5,
    review: "The level of professionalism and expert guidance we received was unmatched. They understood our requirements perfectly and showed us exactly what we were looking for.",
    property: "Purchased in Greater Noida West",
  },
  {
    id: "t3",
    name: "Amit Desai",
    initials: "AD",
    rating: 5,
    review: "I highly recommend Square AR Spaces to anyone looking for premium real estate. Their curation of trusted developers saved us countless hours of research.",
    property: "Purchased in Yamuna Expressway",
  },
];
