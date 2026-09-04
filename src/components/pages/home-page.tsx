"use client";

import { Hero } from "@/components/home/hero";
import {
  LatestDrop,
  CategoryGrid,
  EmbroideryShowcase,
  BestSellers,
  BrandStory,
  NewArrivals,
  CompleteTheLook,
  CustomerReviews,
  InstagramSection,
  TrustStrip,
} from "@/components/home/sections";
import { useReveal } from "@/hooks/use-reveal";

export function HomePage() {
  useReveal();
  return (
    <>
      <Hero />
      <TrustStrip />
      <LatestDrop />
      <CategoryGrid />
      <EmbroideryShowcase />
      <BestSellers />
      <BrandStory />
      <NewArrivals />
      <CompleteTheLook />
      <CustomerReviews />
      <InstagramSection />
    </>
  );
}
