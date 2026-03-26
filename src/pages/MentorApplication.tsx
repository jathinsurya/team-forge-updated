import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Lock, CheckCircle2, Award, ChevronRight, Sparkles } from "lucide-react";
import { useRole, CURRENT_USER } from "@/contexts/RoleContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MentorApplication = () => {
  const { mentorApproved, setMentorApproved, setRole } = useRole();
  const navigate = useNavigate();
  const [linkedin, setLinkedin] = useState("");
  const [expertise, setExpertise] = useState("");
  const [experience, setExperience] = useState("");
  const [motivation, setMotivation] = useState("");
  const [step, setStep] = useState<"form" | "pending" | "approved">(mentorApproved ? "approved" : "form");

  // ── Already approved ────────────────────────────────────────────────────
  if (step === "approved" || mentorApproved) {
    return (
      <div className="p-6 max-w-2xl mx-auto animate-fade-in">
        <div className="bg-card rounded-xl border border-border p-10 shadow-card text-center space-y-6">
          {/* Celebration icon */}
          <div className="relative mx-auto w-fit">
            <div className="h-20 w-20 rounded-full bg-accent/15 flex items-center justify-center mx-auto border-2 border-accent/30">
              <Award className="h-10 w-10 text-accent" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-success flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">🎉 Mentor Role Unlocked!</h1>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">
              Congratulations, <strong>{CURRENT_USER.name}</strong>! You're now an approved mentor on TeamForge.
              Switch to Mentor view to start accepting requests and guiding teams.
            </p>
          </div>

          {/* What's unlocked */}
          <div className="text-left bg-secondary/50 rounded-xl p-5 space-y-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">What's now available</p>
            {[
              { icon: "📥", label: "Mentor Requests",     desc: "Accept or decline project mentorship requests" },
              { icon: "📁", label: "Mentored Projects",   desc: "Track and guide your active project teams"     },
              { icon: "🏅", label: "Award Badges",        desc: "Give Mentor Recommendation badges to standout students" },
              { icon: "🔄", label: "Role Switching",      desc: "Switch freely between Collaborator, Owner and Mentor" },
            ].map(f => (
              <div key={f.label} className="flex items-start gap-3">
                <span className="text-lg">{f.icon}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">{f.label}</p>
                  <p className="text-xs text-muted-foreground">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Button
            size="lg"
            className="w-full gap-2 bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => {
              setRole("mentor");
              toast.success("Switched to Mentor view!");
              navigate("/mentor-requests");
            }}
          >
            <Sparkles className="h-4 w-4" />
            Enter Mentor View
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }

  // ── Pending approval ────────────────────────────────────────────────────
  if (step === "pending") {
    return (
      <div className="p-6 max-w-2xl mx-auto animate-fade-in">
        <div className="bg-card rounded-xl border border-border p-10 shadow-card text-center space-y-6">
          <div className="h-20 w-20 rounded-full bg-warning/10 flex items-center justify-center mx-auto border-2 border-warning/20">
            <CheckCircle2 className="h-10 w-10 text-warning" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-bold text-foreground">Application Submitted</h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Your application is under review. In a real platform this takes 1–2 business days.
              For this demo, approve it instantly below.
            </p>
          </div>

          <div className="bg-secondary/50 rounded-xl p-4 text-left space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Your Application</p>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Expertise:</span> <span className="font-medium text-foreground">{expertise}</span></div>
              <div><span className="text-muted-foreground">Experience:</span> <span className="font-medium text-foreground">{experience} years</span></div>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full gap-2"
            onClick={() => {
              setMentorApproved(true);
              setStep("approved");
              toast.success("Application approved! Mentor role unlocked 🎉");
            }}
          >
            <Award className="h-4 w-4" />
            Approve Application (Demo)
          </Button>
        </div>
      </div>
    );
  }

  // ── Application form ────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Apply for Mentor Role</h1>
        <p className="text-sm text-muted-foreground mt-1">Share your experience to guide student project teams.</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-6 shadow-card space-y-5">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-warning/5 border border-warning/20">
          <Lock className="h-5 w-5 text-warning shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">Requires Admin Approval</p>
            <p className="text-xs text-muted-foreground mt-0.5">Minimum 4 years of professional experience. Applications reviewed within 1–2 business days.</p>
          </div>
        </div>

        <div className="space-y-2">
          <Label>LinkedIn Profile URL <span className="text-destructive">*</span></Label>
          <Input placeholder="https://linkedin.com/in/yourprofile" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Areas of Expertise <span className="text-destructive">*</span></Label>
          <Input placeholder="e.g. React, Machine Learning, UI/UX Design" value={expertise} onChange={e => setExpertise(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Years of Professional Experience <span className="text-destructive">*</span></Label>
          <Input type="number" placeholder="e.g. 5" min={1} value={experience} onChange={e => setExperience(e.target.value)} />
        </div>

        <div className="space-y-2">
          <Label>Why do you want to mentor?</Label>
          <Textarea
            placeholder="Tell us about your motivation and what you hope to offer student teams..."
            rows={4}
            value={motivation}
            onChange={e => setMotivation(e.target.value)}
          />
        </div>

        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            if (!linkedin || !expertise || !experience) {
              toast.error("Please fill in all required fields");
              return;
            }
            setStep("pending");
            toast.success("Application submitted successfully!");
          }}
        >
          Submit Application
        </Button>
      </div>
    </div>
  );
};

export default MentorApplication;
