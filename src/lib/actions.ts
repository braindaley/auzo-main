"use server";

import { summarizeServiceProviderReviews } from '@/ai/flows/summarize-service-provider-reviews';
import type { SummarizeServiceProviderReviewsOutput } from '@/ai/flows/summarize-service-provider-reviews';

export async function getReviewSummary(reviews: string): Promise<SummarizeServiceProviderReviewsOutput> {
  try {
    const summary = await summarizeServiceProviderReviews({ reviews });
    return summary;
  } catch (error) {
    console.error("Error summarizing reviews:", error);
    return { summary: "Sorry, we couldn't generate a summary at this time. Please try again later." };
  }
}
