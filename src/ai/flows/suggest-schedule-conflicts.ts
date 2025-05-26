// use server'
'use server';

/**
 * @fileOverview Suggests potential scheduling conflicts based on existing schedules and resource availability.
 *
 * - suggestScheduleConflicts - A function that suggests scheduling conflicts.
 * - SuggestScheduleConflictsInput - The input type for the suggestScheduleConflicts function.
 * - SuggestScheduleConflictsOutput - The return type for the suggestScheduleConflicts function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestScheduleConflictsInputSchema = z.object({
  teacherSchedule: z.string().describe('The current schedule of the teacher, as a JSON string.'),
  classroomAvailability: z.string().describe('The availability of the classroom, as a JSON string.'),
  proposedScheduleEntry: z.string().describe('The proposed schedule entry, as a JSON string.'),
});
export type SuggestScheduleConflictsInput = z.infer<typeof SuggestScheduleConflictsInputSchema>;

const SuggestScheduleConflictsOutputSchema = z.object({
  conflicts: z.array(z.string()).describe('A list of potential scheduling conflicts.'),
});
export type SuggestScheduleConflictsOutput = z.infer<typeof SuggestScheduleConflictsOutputSchema>;

export async function suggestScheduleConflicts(
  input: SuggestScheduleConflictsInput
): Promise<SuggestScheduleConflictsOutput> {
  return suggestScheduleConflictsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestScheduleConflictsPrompt',
  input: {schema: SuggestScheduleConflictsInputSchema},
  output: {schema: SuggestScheduleConflictsOutputSchema},
  prompt: `You are a scheduling assistant that identifies potential scheduling conflicts.

  Analyze the teacher's current schedule, classroom availability, and the proposed schedule entry to identify any conflicts.

  Teacher Schedule: {{{teacherSchedule}}}
  Classroom Availability: {{{classroomAvailability}}}
  Proposed Schedule Entry: {{{proposedScheduleEntry}}}

  Output a list of any conflicts you find.
  `,
});

const suggestScheduleConflictsFlow = ai.defineFlow(
  {
    name: 'suggestScheduleConflictsFlow',
    inputSchema: SuggestScheduleConflictsInputSchema,
    outputSchema: SuggestScheduleConflictsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
