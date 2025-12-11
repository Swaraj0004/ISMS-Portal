"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

interface Stats {
  totalInterns: number;
  activeInterns: number;
  totalProjects: number;
  completedProjects: number;
  internsByMonth: { _id: number; count: number }[];
  projectStatus: { _id: string; count: number }[];
}

export default function ManagerDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  if (!stats)
    return (
      <p className="text-center mt-20 text-gray-500">Loading dashboard...</p>
    );

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold mb-4">Manager Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Interns</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats.totalInterns}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Interns</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-green-600">
            {stats.activeInterns}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold">
            {stats.totalProjects}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Completed Projects</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-bold text-blue-600">
            {stats.completedProjects}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Interns Joined (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={stats.internsByMonth.map((m) => ({
                  name: monthNames[m._id - 1],
                  count: m.count,
                }))}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.projectStatus}
                  dataKey="count"
                  nameKey="_id"
                  label
                >
                  {stats.projectStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
