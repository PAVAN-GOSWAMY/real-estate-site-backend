"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths } from "date-fns";
import { ChevronLeft, ChevronRight, Clock, MapPin, Phone, MessageSquare, Mail, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface FollowUpCalendarProps {
  followUps: any[];
}

export function FollowUpCalendar({ followUps }: FollowUpCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get padding days for the first row (if month doesn't start on Sunday)
  const startDay = monthStart.getDay();
  const paddingDays = Array.from({ length: startDay }).fill(null);

  const getIcon = (type: string) => {
    switch (type) {
      case "Phone Call": return <Phone className="h-3 w-3" />;
      case "WhatsApp": return <MessageSquare className="h-3 w-3" />;
      case "Email": return <Mail className="h-3 w-3" />;
      case "Site Visit": return <MapPin className="h-3 w-3" />;
      default: return <Clock className="h-3 w-3" />;
    }
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const today = () => setCurrentDate(new Date());

  return (
    <div className="bg-card border border-border/50 rounded-xl overflow-hidden mt-8 shadow-sm">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b border-border/50">
        <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
          {format(currentDate, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={today}>Today</Button>
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 border-b border-border/50 bg-muted/30">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
          <div key={day} className="p-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider border-r border-border/50 last:border-r-0">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)] bg-card">
        {paddingDays.map((_, i) => (
          <div key={`pad-${i}`} className="border-r border-b border-border/50 bg-muted/10 p-2" />
        ))}
        
        {monthDays.map((day, i) => {
          const isToday = isSameDay(day, new Date());
          const dayTasks = followUps.filter(f => isSameDay(new Date(f.follow_up_date), day));
          
          return (
            <div 
              key={day.toISOString()} 
              className={`border-r border-b border-border/50 p-2 hover:bg-muted/10 transition-colors flex flex-col gap-1 overflow-hidden
                ${(i + startDay) % 7 === 6 ? 'border-r-0' : ''}
              `}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-medium h-6 w-6 flex items-center justify-center rounded-full ${isToday ? 'bg-primary text-primary-foreground' : 'text-foreground'}`}>
                  {format(day, "d")}
                </span>
                {dayTasks.length > 0 && (
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-muted/50">
                    {dayTasks.length}
                  </Badge>
                )}
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                {dayTasks.map(task => {
                  const isMissed = task.status === 'Missed' || (task.status === 'Scheduled' && new Date(task.follow_up_date) < new Date());
                  const isCompleted = task.status === 'Completed';
                  
                  return (
                    <Link href={`/admin/leads/${task.lead_id}`} key={task.id}>
                      <div className={`text-[10px] p-1.5 rounded border transition-colors flex items-center gap-1.5 cursor-pointer
                        ${isMissed ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100' : 
                          isCompleted ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100' : 
                          'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100'
                        }`}
                        title={`${task.reminder_type} at ${format(new Date(task.follow_up_date), "h:mm a")} - ${task.leads.full_name}`}
                      >
                        {isMissed && <AlertCircle className="h-3 w-3 shrink-0" />}
                        {!isMissed && getIcon(task.reminder_type)}
                        <span className="truncate flex-1 font-medium">{format(new Date(task.follow_up_date), "h:mm a")}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
        
        {/* Fill remaining grid cells */}
        {Array.from({ length: 42 - paddingDays.length - monthDays.length }).map((_, i) => (
          <div key={`end-pad-${i}`} className="border-r border-b border-border/50 bg-muted/10 p-2" />
        ))}
      </div>
    </div>
  );
}
