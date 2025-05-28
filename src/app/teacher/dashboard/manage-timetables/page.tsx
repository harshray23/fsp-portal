
"use client";

import { PageHeader } from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Edit, Trash2, Eye, Loader2 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react'; 
import { useForm, Controller } from "react-hook-form"; // Added Controller
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";

// Mock data for batches and days cleared
const mockBatches: { id: string; name: string; }[] = [];
const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface TimetableEntry {
  id: string;
  batch: string;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  room: string;
  status: string; 
}

const scheduleEntrySchema = z.object({
  batch: z.string().min(1, "Batch is required"),
  day: z.string().min(1, "Day is required"),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid start time (HH:MM)"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid end time (HH:MM)")
    .refine(data => {
      if (data.startTime && data.endTime) {
        return data.endTime > data.startTime;
      }
      return true;
    }, { message: "End time must be after start time" }),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  room: z.string().min(1, "Room is required"),
});

type ScheduleEntryFormValues = z.infer<typeof scheduleEntrySchema>;

export default function ManageTimetablesPage() {
  const [timetables, setTimetables] = useState<TimetableEntry[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const formDefaultValues = useMemo(() => ({
    batch: "",
    day: "",
    startTime: "",
    endTime: "",
    subject: "",
    room: "",
  }), []);

  const form = useForm<ScheduleEntryFormValues>({
    resolver: zodResolver(scheduleEntrySchema),
    defaultValues: formDefaultValues,
  });

  async function onSubmit(values: ScheduleEntryFormValues) {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    
    const newEntry: TimetableEntry = {
      id: `TT-${Date.now()}`, 
      ...values,
      status: 'Scheduled',
    };
    setTimetables(prev => [...prev, newEntry]);
    toast({
      title: "Schedule Entry Added",
      description: `${values.subject} for ${values.batch} has been scheduled.`,
    });
    setIsLoading(false);
    setIsDialogOpen(false);
    form.reset(formDefaultValues);
  }
  
  useEffect(() => {
    if (!isDialogOpen) {
      form.reset(formDefaultValues);
    }
  }, [isDialogOpen, form, formDefaultValues]);

  return (
    <>
      <PageHeader 
        title="Manage Timetables" 
        description="Create, view, and update class schedules."
        actions={
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-4 w-4" /> Add New Schedule Entry</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Schedule Entry</DialogTitle>
                <DialogDescription>
                  Fill in the details for the new class schedule.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="batch-form">Batch</Label> 
                    <Controller
                      name="batch"
                      control={form.control}
                      render={({ field }) => (
                        <Select onValueChange={field.onChange} defaultValue={field.value} disabled={mockBatches.length === 0}>
                          <SelectTrigger id="batch-form">
                            <SelectValue placeholder={mockBatches.length === 0 ? "No batches available" : "Select Batch"} />
                          </SelectTrigger>
                          <SelectContent>
                            {mockBatches.map(batch => (
                              <SelectItem key={batch.id} value={batch.name}>{batch.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                    {form.formState.errors.batch && <p className="text-xs text-destructive">{form.formState.errors.batch.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="day-form">Day of Week</Label>
                     <Controller
                        name="day"
                        control={form.control}
                        render={({ field }) => (
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <SelectTrigger id="day-form">
                              <SelectValue placeholder="Select Day" />
                            </SelectTrigger>
                            <SelectContent>
                              {daysOfWeek.map(day => (
                                <SelectItem key={day} value={day}>{day}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    {form.formState.errors.day && <p className="text-xs text-destructive">{form.formState.errors.day.message}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label htmlFor="startTime">Start Time</Label>
                    <Input id="startTime" type="time" {...form.register('startTime')} />
                    {form.formState.errors.startTime && <p className="text-xs text-destructive">{form.formState.errors.startTime.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input id="endTime" type="time" {...form.register('endTime')} />
                    {form.formState.errors.endTime && <p className="text-xs text-destructive">{form.formState.errors.endTime.message}</p>}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="e.g., Advanced Java" {...form.register('subject')} />
                  {form.formState.errors.subject && <p className="text-xs text-destructive">{form.formState.errors.subject.message}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="room">Room/Venue</Label>
                  <Input id="room" placeholder="e.g., CL-05 or Online" {...form.register('room')} />
                  {form.formState.errors.room && <p className="text-xs text-destructive">{form.formState.errors.room.message}</p>}
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                  <Button type="submit" disabled={isLoading || mockBatches.length === 0}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Save Schedule Entry
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Current Timetable Entries</CardTitle>
          <CardDescription>List of scheduled classes.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timetables.length === 0 ? (
                 <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                    No timetable entries found. Start by adding a new schedule entry.
                    </TableCell>
                </TableRow>
              ) : (
                timetables.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.batch}</TableCell>
                    <TableCell>{entry.day}</TableCell>
                    <TableCell>{entry.startTime} - {entry.endTime}</TableCell>
                    <TableCell>{entry.subject}</TableCell>
                    <TableCell>{entry.room}</TableCell>
                    <TableCell>{entry.status}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" className="mr-1" onClick={() => alert(`View details for ${entry.subject}`)}><Eye className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" className="mr-1" onClick={() => alert(`Edit ${entry.subject}`)}><Edit className="h-4 w-4" /></Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          setTimetables(prev => prev.filter(item => item.id !== entry.id));
                          toast({ title: "Entry Deleted", description: `${entry.subject} schedule removed.`});
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
}
