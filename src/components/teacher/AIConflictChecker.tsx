"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import type { SuggestScheduleConflictsInput, SuggestScheduleConflictsOutput } from '@/ai/flows/suggest-schedule-conflicts';
import { suggestScheduleConflicts } from '@/ai/flows/suggest-schedule-conflicts'; // AI function
import { useToast } from "@/hooks/use-toast";

const exampleTeacherSchedule = JSON.stringify([
  { day: "Monday", startTime: "09:00", endTime: "11:00", subject: "Math", classroom: "CR101" },
  { day: "Monday", startTime: "14:00", endTime: "16:00", subject: "Physics", classroom: "CR102" }
], null, 2);

const exampleClassroomAvailability = JSON.stringify([
  { classroom: "CR101", day: "Monday", availableSlots: [{ startTime: "08:00", endTime: "12:00" }, { startTime: "13:00", endTime: "17:00" }] },
  { classroom: "CR102", day: "Monday", availableSlots: [{ startTime: "09:00", endTime: "11:00" }, { startTime: "14:00", endTime: "18:00" }] }
], null, 2);

const exampleProposedEntry = JSON.stringify(
  { day: "Monday", startTime: "10:00", endTime: "12:00", subject: "New Course", classroom: "CR101" },
null, 2);


export function AIConflictChecker() {
  const { toast } = useToast();
  const [teacherSchedule, setTeacherSchedule] = useState(exampleTeacherSchedule);
  const [classroomAvailability, setClassroomAvailability] = useState(exampleClassroomAvailability);
  const [proposedEntry, setProposedEntry] = useState(exampleProposedEntry);
  const [isLoading, setIsLoading] = useState(false);
  const [conflicts, setConflicts] = useState<string[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckConflicts = async () => {
    setIsLoading(true);
    setConflicts(null);
    setError(null);

    try {
      const input: SuggestScheduleConflictsInput = {
        teacherSchedule,
        classroomAvailability,
        proposedScheduleEntry: proposedEntry,
      };
      
      // Validate JSON inputs
      JSON.parse(teacherSchedule);
      JSON.parse(classroomAvailability);
      JSON.parse(proposedEntry);

      const result: SuggestScheduleConflictsOutput = await suggestScheduleConflicts(input);
      setConflicts(result.conflicts);
      if (result.conflicts.length === 0) {
        toast({ title: "No Conflicts Found", description: "The proposed schedule entry seems clear.", variant: "default" });
      } else {
        toast({ title: "Potential Conflicts Found", description: "Review the conflicts listed below.", variant: "destructive" });
      }
    } catch (e: any) {
      console.error("Error checking conflicts:", e);
      let errorMessage = "Failed to check conflicts.";
      if (e instanceof SyntaxError) {
        errorMessage = "Invalid JSON format in one of the input fields. Please check and try again.";
      } else if (e.message) {
        errorMessage = e.message;
      }
      setError(errorMessage);
      toast({ title: "Error", description: errorMessage, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>AI Scheduling Assistant</CardTitle>
        <CardDescription>Check for potential conflicts using AI. Provide schedules in JSON format.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="teacher-schedule">Teacher's Current Schedule (JSON)</Label>
          <Textarea
            id="teacher-schedule"
            value={teacherSchedule}
            onChange={(e) => setTeacherSchedule(e.target.value)}
            rows={5}
            placeholder="Enter teacher's schedule as JSON..."
            className="font-mono text-xs"
          />
        </div>
        <div>
          <Label htmlFor="classroom-availability">Classroom Availability (JSON)</Label>
          <Textarea
            id="classroom-availability"
            value={classroomAvailability}
            onChange={(e) => setClassroomAvailability(e.target.value)}
            rows={5}
            placeholder="Enter classroom availability as JSON..."
            className="font-mono text-xs"
          />
        </div>
        <div>
          <Label htmlFor="proposed-entry">Proposed Schedule Entry (JSON)</Label>
          <Textarea
            id="proposed-entry"
            value={proposedEntry}
            onChange={(e) => setProposedEntry(e.target.value)}
            rows={3}
            placeholder="Enter proposed schedule entry as JSON..."
            className="font-mono text-xs"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start space-y-4">
        <Button onClick={handleCheckConflicts} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Check for Conflicts
        </Button>
        
        {error && (
          <div className="w-full p-3 bg-destructive/10 border border-destructive text-destructive rounded-md text-sm">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold">Error:</p>
                <p>{error}</p>
              </div>
            </div>
          </div>
        )}

        {conflicts !== null && !error && (
          <div className={`w-full p-3 rounded-md text-sm ${conflicts.length > 0 ? 'bg-destructive/10 border border-destructive text-destructive' : 'bg-green-500/10 border border-green-500 text-green-700'}`}>
            {conflicts.length > 0 ? (
              <>
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold">Potential Conflicts Found:</p>
                    <ul className="list-disc list-inside mt-1">
                      {conflicts.map((conflict, index) => (
                        <li key={index}>{conflict}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="font-semibold">No conflicts found. The proposed schedule seems clear.</p>
              </div>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
