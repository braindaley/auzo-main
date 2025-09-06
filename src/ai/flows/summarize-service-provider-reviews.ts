'use server';
/**
 * @fileOverview Summarizes service provider reviews using AI.
 *
 * - summarizeServiceProviderReviews - A function that summarizes reviews for a service provider.
 * - SummarizeServiceProviderReviewsInput - The input type for the summarizeServiceProviderReviews function.
 * - SummarizeServiceProviderReviewsOutput - The return type for the summarizeServiceProviderReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeServiceProviderReviewsInputSchema = z.object({
  reviews: z
    .string()
    .describe('The reviews for the service provider.'),
});
export type SummarizeServiceProviderReviewsInput =
  z.infer<typeof SummarizeServiceProviderReviewsInputSchema>;

const SummarizeServiceProviderReviewsOutputSchema = z.object({
  summary: z.string().describe('The summary of the reviews.'),
});
export type SummarizeServiceProviderReviewsOutput =
  z.infer<typeof SummarizeServiceProviderReviewsOutputSchema>;

export async function summarizeServiceProviderReviews(
  input: SummarizeServiceProviderReviewsInput
): Promise<SummarizeServiceProviderReviewsOutput> {
  return summarizeServiceProviderReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeServiceProviderReviewsPrompt',
  input: {schema: SummarizeServiceProviderReviewsInputSchema},
  output: {schema: SummarizeServiceProviderReviewsOutputSchema},
  prompt: `Summarize the following reviews for a service provider.  Highlight key strengths and weaknesses.

Reviews: {{{reviews}}}`,
});

const summarizeServiceProviderReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeServiceProviderReviewsFlow',
    inputSchema: SummarizeServiceProviderReviewsInputSchema,
    outputSchema: SummarizeServiceProviderReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
