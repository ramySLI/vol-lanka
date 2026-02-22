import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2, Circle, Plane, FileText, HeartPulse } from "lucide-react";

export default function DashboardPage() {
    // Mock Data
    const user = { name: "Jane Doe" };
    const activeBooking = {
        programTitle: "Sea Turtle Conservation",
        destination: "Galle, Sri Lanka",
        startDate: new Date(new Date().setMonth(new Date().getMonth() + 2)), // 2 months from now
        duration: 4,
        status: "confirmed"
    };

    const tasks = [
        { id: 1, title: "Pay Remaining Balance", status: "completed", icon: <FileText className="w-4 h-4" /> },
        { id: 2, title: "Upload Passport Copy", status: "pending", icon: <FileText className="w-4 h-4" /> },
        { id: 3, title: "Submit Arrival Flight Details", status: "pending", icon: <Plane className="w-4 h-4" /> },
        { id: 4, title: "Provide Travel Insurance Policy", status: "pending", icon: <HeartPulse className="w-4 h-4" /> },
    ];

    const daysUntilTrip = Math.floor((activeBooking.startDate.getTime() - new Date().getTime()) / (1000 * 3600 * 24));

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Welcome back, {user.name}</h1>
                    <p className="text-muted-foreground mt-1">Here's the status of your upcoming volunteer journey.</p>
                </div>
                <Button variant="outline" asChild>
                    <Link href="/programs">Find Another Program</Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Main Status Column */}
                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-primary/5 border-primary/20">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardDescription className="font-semibold text-primary uppercase tracking-wider mb-1">Upcoming Trip</CardDescription>
                                    <CardTitle className="text-2xl">{activeBooking.programTitle}</CardTitle>
                                </div>
                                <div className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                                    In {daysUntilTrip} Days
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 gap-4 text-sm mt-2">
                                <div>
                                    <span className="text-muted-foreground block mb-1">Destination</span>
                                    <span className="font-medium">{activeBooking.destination}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Dates</span>
                                    <span className="font-medium">
                                        {activeBooking.startDate.toLocaleDateString()} -
                                        {" "}{new Date(activeBooking.startDate.getTime() + (activeBooking.duration * 7 * 24 * 60 * 60 * 1000)).toLocaleDateString()}
                                    </span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Duration</span>
                                    <span className="font-medium">{activeBooking.duration} Weeks</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground block mb-1">Status</span>
                                    <span className="font-medium text-green-600 capitalize">● {activeBooking.status}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Preparation Checklist</CardTitle>
                            <CardDescription>Complete these mandatory steps before your arrival.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {tasks.map(task => (
                                    <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer gap-3">
                                        <div className="flex items-start sm:items-center gap-3 break-words">
                                            <div className="mt-1 sm:mt-0 shrink-0">
                                                {task.status === 'completed' ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <span className="text-muted-foreground p-1 bg-muted rounded shrink-0">{task.icon}</span>
                                                <span className={task.status === 'completed' ? 'line-through text-muted-foreground' : 'font-medium'}>
                                                    {task.title}
                                                </span>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" className={task.status === 'completed' ? 'hidden sm:invisible' : 'self-end sm:self-auto'}>
                                            Update
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button variant="outline" className="w-full justify-start">Edit Profile</Button>
                            <Button variant="outline" className="w-full justify-start">Payment History</Button>
                            <Button variant="outline" className="w-full justify-start">Emergency Contacts</Button>
                            <Button variant="outline" className="w-full justify-start">Contact Support</Button>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-50 border-slate-200">
                        <CardHeader>
                            <CardTitle className="text-lg">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground mb-4">
                                Our local support team is here to assist you with your preparations.
                            </p>
                            <Button className="w-full">Message Coordinator</Button>
                        </CardContent>
                    </Card>
                </div>

            </div>
        </div>
    );
}
