import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Medal, ExternalLink } from "lucide-react";

// Different datasets for each time period
const weeklyData = [
  { rank: 1, user: "Rohan Mehta",        initials: "RM", xp: 420,  reputation: 89, tasks: 7,  projects: 2 },
  { rank: 2, user: "Sneha Iyer",         initials: "SI", xp: 380,  reputation: 82, tasks: 6,  projects: 1 },
  { rank: 3, user: "Priya Patel",        initials: "PP", xp: 320,  reputation: 93, tasks: 5,  projects: 2 },
  { rank: 4, user: "Arjun Sharma",       initials: "AS", xp: 280,  reputation: 87, tasks: 4,  projects: 1 },
  { rank: 5, user: "Vikram Nair",        initials: "VN", xp: 220,  reputation: 78, tasks: 4,  projects: 1 },
  { rank: 6, user: "Ananya Reddy",       initials: "AR", xp: 180,  reputation: 75, tasks: 3,  projects: 1 },
  { rank: 7, user: "Kiran Bose",         initials: "KB", xp: 160,  reputation: 71, tasks: 2,  projects: 1 },
  { rank: 8, user: "Meera Pillai",       initials: "MP", xp: 120,  reputation: 68, tasks: 2,  projects: 1 },
];

const monthlyData = [
  { rank: 1, user: "Priya Patel",        initials: "PP", xp: 1540, reputation: 93, tasks: 18, projects: 4 },
  { rank: 2, user: "Dr. Divya Krishnan",initials: "DK", xp: 1380, reputation: 96, tasks: 16, projects: 5 },
  { rank: 3, user: "Arjun Sharma",       initials: "AS", xp: 1200, reputation: 87, tasks: 14, projects: 3 },
  { rank: 4, user: "Rohan Mehta",        initials: "RM", xp: 1050, reputation: 89, tasks: 12, projects: 3 },
  { rank: 5, user: "Sneha Iyer",         initials: "SI", xp: 890,  reputation: 82, tasks: 10, projects: 2 },
  { rank: 6, user: "Vikram Nair",        initials: "VN", xp: 760,  reputation: 78, tasks: 8,  projects: 2 },
  { rank: 7, user: "Ananya Reddy",       initials: "AR", xp: 640,  reputation: 75, tasks: 7,  projects: 2 },
  { rank: 8, user: "Kiran Bose",         initials: "KB", xp: 520,  reputation: 71, tasks: 5,  projects: 1 },
];

const allTimeData = [
  { rank: 1, user: "Dr. Divya Krishnan",initials: "DK", xp: 4200, reputation: 96, tasks: 42, projects: 8 },
  { rank: 2, user: "Priya Patel",        initials: "PP", xp: 3850, reputation: 93, tasks: 38, projects: 7 },
  { rank: 3, user: "Rohan Mehta",        initials: "RM", xp: 3400, reputation: 89, tasks: 35, projects: 6 },
  { rank: 4, user: "Arjun Sharma",       initials: "AS", xp: 2450, reputation: 87, tasks: 24, projects: 5 },
  { rank: 5, user: "Sneha Iyer",         initials: "SI", xp: 2100, reputation: 82, tasks: 20, projects: 4 },
  { rank: 6, user: "Vikram Nair",        initials: "VN", xp: 1900, reputation: 78, tasks: 18, projects: 4 },
  { rank: 7, user: "Ananya Reddy",       initials: "AR", xp: 1750, reputation: 75, tasks: 16, projects: 3 },
  { rank: 8, user: "Kiran Bose",         initials: "KB", xp: 1500, reputation: 71, tasks: 14, projects: 3 },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Trophy className="h-4 w-4 text-warning" />;
  if (rank === 2) return <Medal className="h-4 w-4 text-slate-400" />;
  if (rank === 3) return <Medal className="h-4 w-4 text-accent" />;
  return <span className="text-sm text-muted-foreground font-medium">{rank}</span>;
};

type Row = typeof weeklyData[0];

const LeaderboardTable = ({ data, onUserClick }: { data: Row[]; onUserClick: (user: string) => void }) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm">
      <thead>
        <tr className="border-b border-border">
          <th className="text-left pb-3 font-medium text-muted-foreground w-16">Rank</th>
          <th className="text-left pb-3 font-medium text-muted-foreground">User</th>
          <th className="text-left pb-3 font-medium text-muted-foreground">XP</th>
          <th className="text-left pb-3 font-medium text-muted-foreground">Reputation</th>
          <th className="text-left pb-3 font-medium text-muted-foreground">Tasks</th>
          <th className="text-left pb-3 font-medium text-muted-foreground">Projects</th>
          <th className="w-8"></th>
        </tr>
      </thead>
      <tbody>
        {data.map(row => (
          <tr key={row.rank}
            className="border-b border-border last:border-none hover:bg-secondary/50 transition-colors cursor-pointer group"
            onClick={() => onUserClick(row.user)}
          >
            <td className="py-3">{getRankIcon(row.rank)}</td>
            <td className="py-3">
              <div className="flex items-center gap-2">
                <div className={`h-7 w-7 rounded-full flex items-center justify-center text-primary-foreground text-[10px] font-bold ${
                  row.rank === 1 ? "bg-warning" : row.rank === 2 ? "bg-slate-400" : row.rank === 3 ? "bg-accent" : "bg-primary"
                }`}>
                  {row.initials}
                </div>
                <span className="font-medium text-foreground group-hover:text-primary transition-colors">{row.user}</span>
              </div>
            </td>
            <td className="py-3 font-semibold text-foreground">{row.xp.toLocaleString()}</td>
            <td className="py-3 text-muted-foreground">{row.reputation}</td>
            <td className="py-3 text-muted-foreground">{row.tasks}</td>
            <td className="py-3 text-muted-foreground">{row.projects}</td>
            <td className="py-3">
              <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const Leaderboard = () => {
  const navigate = useNavigate();
  const handleUserClick = (user: string) => navigate("/profile", { state: { userName: user } });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Leaderboard</h1>
        <p className="text-sm text-muted-foreground mt-1">See who's leading in XP and contributions. Click any user to view their profile.</p>
      </div>

      <div className="bg-card rounded-xl border border-border p-5 shadow-card">
        <Tabs defaultValue="weekly">
          <TabsList className="mb-4">
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="alltime">All Time</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">  <LeaderboardTable data={weeklyData}  onUserClick={handleUserClick} /></TabsContent>
          <TabsContent value="monthly"> <LeaderboardTable data={monthlyData} onUserClick={handleUserClick} /></TabsContent>
          <TabsContent value="alltime"> <LeaderboardTable data={allTimeData} onUserClick={handleUserClick} /></TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Leaderboard;
