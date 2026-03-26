import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search, MessageSquare, Book, Zap, Users, Shield, Trophy, HelpCircle, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const faqs = [
  {
    category: "Getting Started",
    icon: Book,
    items: [
      {
        q: "How do I create a project?",
        a: "Switch your role to 'Project Owner' from the role switcher in the header. Then navigate to 'Create Project' in the sidebar, fill in your project details including title, description, objectives, skills required, and estimated duration, and submit."
      },
      {
        q: "How do I apply to join a project?",
        a: "Browse available projects from the 'Projects' section. Click on any project to view details, then click 'Apply to Join Project'. The project owner will review your application and notify you of the decision."
      },
      {
        q: "Can I be both an owner and a collaborator?",
        a: "Yes! You can own some projects and collaborate in others simultaneously. Additionally, within your own project you can enable the 'Also work as collaborator' toggle to take on and complete tasks yourself."
      },
    ]
  },
  {
    category: "XP & Reputation",
    icon: Zap,
    items: [
      {
        q: "How do I earn XP?",
        a: "XP is earned when your submitted tasks are approved by the project owner. Easy tasks give 10 XP, Medium tasks 20 XP, and Hard tasks 40 XP. You also earn a +5 XP early completion bonus if you submit before the deadline."
      },
      {
        q: "What is the Reputation Score?",
        a: "Reputation measures your reliability and trustworthiness on the platform. It increases (+8) when tasks are approved, and decreases when tasks need revision (-3), deadlines are missed (-5), or you leave a project midway (-20). Mentor badges give a big +20 boost."
      },
      {
        q: "Can my XP decrease?",
        a: "No — XP only ever increases once earned. However, your Reputation Score can go up or down based on your behavior and contributions. Inactive users also experience slow reputation decay after 30 days."
      },
    ]
  },
  {
    category: "Tasks & Workflow",
    icon: HelpCircle,
    items: [
      {
        q: "What are the task status stages?",
        a: "Tasks follow this workflow: Open → In Progress → In Review → Approved (or sent back for Revision). You start a task to move it to 'In Progress', then submit it to move it to 'In Review', and the owner approves or requests changes."
      },
      {
        q: "What happens if I miss a task deadline?",
        a: "Missing a deadline results in a -5 reputation penalty when you eventually submit. Try to submit early — early completion gives you +5 XP bonus and keeps your reputation intact."
      },
      {
        q: "Can an owner complete their own tasks?",
        a: "Yes. Enable the 'Also work as collaborator' toggle in the project workspace. This lets you accept and submit tasks assigned to yourself, while still retaining all owner management capabilities."
      },
    ]
  },
  {
    category: "Mentors",
    icon: Shield,
    items: [
      {
        q: "How do I request a mentor for my project?",
        a: "In your project workspace, click 'Request Mentor' (or open the Mentors tab). You can browse available approved mentors and send them a request. You can also browse mentors from the 'Mentors' page in the sidebar. Once accepted, their status updates in real-time."
      },
      {
        q: "How do I become a mentor?",
        a: "Navigate to 'Mentor Application' and submit your LinkedIn profile link. Administrators review your application based on professional experience (4–5+ years in a relevant field), profile authenticity, and professional conduct."
      },
      {
        q: "What can mentors do?",
        a: "Mentors provide guidance, answer technical questions, suggest improvements, and issue recommendation badges to collaborators. Mentors cannot approve tasks, assign XP, or modify scores — their role is entirely advisory."
      },
    ]
  },
  {
    category: "Leaderboard & Profile",
    icon: Trophy,
    items: [
      {
        q: "How is the leaderboard ranked?",
        a: "Rankings are determined strictly by total XP earned through approved tasks. Weekly, Monthly, and All-Time leaderboards are available. Only approved tasks count — tasks in review or rejected do not affect rankings."
      },
      {
        q: "Can I view other users' profiles?",
        a: "Yes — click on any user's name in the Leaderboard to view their public profile, including their skills, projects, badges, XP, and reputation."
      },
      {
        q: "How do I hide myself from the leaderboard?",
        a: "Go to Settings → Privacy and toggle off 'Appear on Leaderboard'. This removes you from public rankings while your XP and contributions continue to accumulate."
      },
    ]
  },
];

const Help = () => {
  const [search, setSearch] = useState("");
  const [reportUser, setReportUser]       = useState("");
  const [reportReason, setReportReason]   = useState("");
  const [reportDetails, setReportDetails] = useState("");
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const handleReport = () => {
    if (!reportUser.trim()) { toast.error("Please enter the username to report"); return; }
    if (!reportReason)      { toast.error("Please select a reason");              return; }
    if (!reportDetails.trim() || reportDetails.trim().length < 20) {
      toast.error("Please provide at least 20 characters of detail"); return;
    }
    setReportSubmitted(true);
    toast.success("Report submitted. Our team will review it within 48 hours.");
  };

  const filtered = faqs.map(section => ({
    ...section,
    items: section.items.filter(
      item => item.q.toLowerCase().includes(search.toLowerCase()) || item.a.toLowerCase().includes(search.toLowerCase())
    )
  })).filter(s => s.items.length > 0);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help & Support</h1>
        <p className="text-sm text-muted-foreground mt-1">Find answers to common questions about TeamForge.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search help articles..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* FAQ Sections */}
      {filtered.map((section) => (
        <div key={section.category} className="bg-card rounded-xl border border-border p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <section.icon className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-foreground">{section.category}</h2>
            <Badge variant="secondary" className="text-xs">{section.items.length}</Badge>
          </div>
          <Accordion type="single" collapsible className="space-y-1">
            {section.items.map((item, i) => (
              <AccordionItem key={i} value={`${section.category}-${i}`} className="border-border">
                <AccordionTrigger className="text-sm font-medium text-foreground text-left hover:no-underline py-3">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pb-3">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <HelpCircle className="h-10 w-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No results found for "{search}"</p>
        </div>
      )}

      {/* Report a User */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <h2 className="font-semibold text-foreground">Report a User</h2>
        </div>

        {reportSubmitted ? (
          <div className="flex flex-col items-center py-6 gap-3 text-center">
            <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <p className="font-semibold text-foreground">Report Submitted</p>
            <p className="text-sm text-muted-foreground max-w-sm">
              Thank you for keeping TeamForge safe. Our moderation team will review your report within 48 hours and take appropriate action.
            </p>
            <Button variant="outline" size="sm" className="mt-1" onClick={() => {
              setReportUser(""); setReportReason(""); setReportDetails(""); setReportSubmitted(false);
            }}>
              Submit Another Report
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              If a user is violating platform guidelines — harassment, cheating, fake work submissions, or misconduct — you can report them confidentially. All reports are reviewed by our admin team.
            </p>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username to Report</label>
              <Input
                placeholder="e.g. rohanmehta or Rohan Mehta"
                value={reportUser}
                onChange={e => setReportUser(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Reason</label>
              <Select value={reportReason} onValueChange={setReportReason}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="harassment">Harassment or bullying</SelectItem>
                  <SelectItem value="fake_work">Fake or plagiarised work submissions</SelectItem>
                  <SelectItem value="cheating">Cheating or gaming XP</SelectItem>
                  <SelectItem value="inappropriate">Inappropriate content or behaviour</SelectItem>
                  <SelectItem value="impersonation">Impersonation or false identity</SelectItem>
                  <SelectItem value="other">Other violation</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Details</label>
              <Textarea
                placeholder="Describe what happened, including dates, project names, or any evidence you can share. Minimum 20 characters."
                value={reportDetails}
                onChange={e => setReportDetails(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <p className="text-xs text-muted-foreground">{reportDetails.length} characters · minimum 20</p>
            </div>
            <Button onClick={handleReport} className="w-full gap-2" variant="destructive">
              <AlertTriangle className="h-4 w-4" /> Submit Report
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Reports are confidential. False reports may result in action against your own account.
            </p>
          </div>
        )}
      </div>

      {/* Contact Support */}
      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <div className="flex items-start gap-3">
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <MessageSquare className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Still need help?</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Can't find what you're looking for? Reach out to our support team at{" "}
              <a href="mailto:support@teamforge.io" className="text-primary hover:underline font-medium">
                support@teamforge.io
              </a>
              . We typically respond within 24 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Help;
