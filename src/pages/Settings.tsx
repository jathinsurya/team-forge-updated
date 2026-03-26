import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Bell, Eye, Trash2, Key, User, Palette, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useRole, CURRENT_USER } from "@/contexts/RoleContext";

const SectionHeader = ({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) => (
  <div className="flex items-start gap-3 mb-5">
    <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
      <Icon className="h-4 w-4 text-primary" />
    </div>
    <div>
      <h2 className="font-semibold text-foreground">{title}</h2>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

const Settings = () => {

  const [skillInput, setSkillInput] = useState("");

  const { userSkills, setUserSkills } = useRole();
  const [notifications, setNotifications] = useState({
    taskAssigned: true, taskApproved: true, projectInvite: true,
    mentorRequest: false, leaderboardUpdate: false, weeklyDigest: true,
  });
  const [privacy, setPrivacy] = useState({
    publicProfile: true, showXP: true, showProjects: true, showOnLeaderboard: true,
  });
  const [theme, setTheme] = useState("system");
  const [language, setLanguage] = useState("en");

  const handleSave = (section: string) => toast.success(`${section} settings saved successfully`);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (userSkills.includes(trimmed)) { toast.info("Skill already added"); return; }
    setUserSkills([...userSkills, trimmed]);
    setSkillInput("");
  };

  const removeSkill = (skill: string) => setUserSkills(userSkills.filter(s => s !== skill));

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your account preferences and privacy.</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <SectionHeader icon={User} title="Profile Information" description="Update your public profile details." />
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-1.5 block">Full Name</Label>
              <Input defaultValue={CURRENT_USER.name} />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Username</Label>
              <Input defaultValue={CURRENT_USER.username} />
            </div>
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Bio</Label>
            <Input defaultValue={CURRENT_USER.title + ' · ' + CURRENT_USER.university} />
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">LinkedIn Profile URL</Label>
            <Input placeholder="https://linkedin.com/in/yourprofile" />
          </div>

          <Separator />

          {/* Skills editor */}
          <div>
            <Label className="text-sm mb-1.5 block">My Skills</Label>
            <p className="text-xs text-muted-foreground mb-2">Add skills as tags. These appear on your profile and dashboard.</p>
            <div className="flex gap-2 mb-3">
              <Input
                placeholder="e.g. React, Python, Machine Learning"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                className="flex-1"
              />
              <Button type="button" size="sm" onClick={addSkill} className="shrink-0">
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>
            {userSkills.length === 0
              ? <p className="text-xs text-muted-foreground italic">No skills added yet.</p>
              : <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <Badge key={skill} variant="secondary" className="text-sm px-3 py-1 flex items-center gap-1.5">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-muted-foreground hover:text-foreground transition-colors ml-0.5">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
            }
          </div>

          <Button size="sm" onClick={() => handleSave("Profile")}>Save Profile</Button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <SectionHeader icon={Bell} title="Notifications" description="Choose what you want to be notified about." />
        <div className="space-y-4">
          {[
            { key: "taskAssigned",      label: "Task Assigned",         desc: "When a new task is assigned to you" },
            { key: "taskApproved",      label: "Task Approved",         desc: "When your submitted task gets approved" },
            { key: "projectInvite",     label: "Project Invite",        desc: "When you receive an invitation to join a project" },
            { key: "mentorRequest",     label: "Mentor Request Updates", desc: "When a mentor accepts or rejects your request" },
            { key: "leaderboardUpdate", label: "Leaderboard Changes",   desc: "When your rank on the leaderboard changes" },
            { key: "weeklyDigest",      label: "Weekly Digest",         desc: "Weekly summary of your contributions and XP" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={notifications[key as keyof typeof notifications]}
                onCheckedChange={(v) => setNotifications(p => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
          <Button size="sm" onClick={() => handleSave("Notification")}>Save Notifications</Button>
        </div>
      </div>

      {/* Privacy Settings */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <SectionHeader icon={Eye} title="Privacy" description="Control what others can see about you." />
        <div className="space-y-4">
          {[
            { key: "publicProfile",      label: "Public Profile",          desc: "Allow anyone to view your profile" },
            { key: "showXP",             label: "Show XP & Reputation",    desc: "Display your XP and reputation on your profile" },
            { key: "showProjects",       label: "Show Projects",           desc: "Display your project history publicly" },
            { key: "showOnLeaderboard",  label: "Appear on Leaderboard",   desc: "Include yourself in the platform leaderboard" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <Switch
                checked={privacy[key as keyof typeof privacy]}
                onCheckedChange={(v) => setPrivacy(p => ({ ...p, [key]: v }))}
              />
            </div>
          ))}
          <Button size="sm" onClick={() => handleSave("Privacy")}>Save Privacy</Button>
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <SectionHeader icon={Palette} title="Appearance & Language" description="Personalize your experience." />
        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-1.5 block">Theme</Label>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System Default</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-sm mb-1.5 block">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="hi">Hindi</SelectItem>
                <SelectItem value="ta">Tamil</SelectItem>
                <SelectItem value="te">Telugu</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button size="sm" onClick={() => handleSave("Appearance")}>Save Appearance</Button>
        </div>
      </div>

      {/* Security */}
      <div className="bg-card rounded-xl border border-border p-6 shadow-card">
        <SectionHeader icon={Key} title="Security" description="Manage your account security settings." />
        <div className="space-y-4">
          <div>
            <Label className="text-sm mb-1.5 block">Current Password</Label>
            <Input type="password" placeholder="••••••••" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm mb-1.5 block">New Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
            <div>
              <Label className="text-sm mb-1.5 block">Confirm Password</Label>
              <Input type="password" placeholder="••••••••" />
            </div>
          </div>
          <Button size="sm" onClick={() => handleSave("Password")}>Update Password</Button>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-card rounded-xl border border-destructive/30 p-6 shadow-card">
        <SectionHeader icon={Trash2} title="Danger Zone" description="Irreversible account actions." />
        <div className="flex items-center justify-between p-4 rounded-lg bg-destructive/5 border border-destructive/20">
          <div>
            <p className="text-sm font-medium text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground">Permanently delete your account and all associated data.</p>
          </div>
          <Button variant="destructive" size="sm" onClick={() => toast.error("Account deletion requires email confirmation.")}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
