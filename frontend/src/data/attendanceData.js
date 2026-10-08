export const attendanceData = [
  {
    id: 1,
    code: "ISTS301P",
    name: "Advanced Competitive Coding - I",
    attended: 29,
    total: 34,
    slot: "A1 + TA1",
    faculty: "Faculty Member",
    upcomingClasses: 6,
  },
  {
    id: 2,
    code: "ISWE310L",
    name: "Natural Language Processing",
    attended: 27,
    total: 33,
    slot: "B2 + TB2",
    faculty: "Faculty Member",
    upcomingClasses: 5,
  },
  {
    id: 3,
    code: "ISWE402L",
    name: "Software Metrics",
    attended: 26,
    total: 32,
    slot: "C1 + TC1",
    faculty: "Faculty Member",
    upcomingClasses: 7,
  },
  {
    id: 4,
    code: "ISWE404L",
    name: "Design Patterns",
    attended: 28,
    total: 33,
    slot: "D2 + TD2",
    faculty: "Faculty Member",
    upcomingClasses: 6,
  },
  {
    id: 5,
    code: "ISWE407L",
    name: "User Interface and User Experience Design",
    attended: 27,
    total: 32,
    slot: "E1 + TE1",
    faculty: "Faculty Member",
    upcomingClasses: 5,
  },
  {
    id: 6,
    code: "ISWE407P",
    name: "User Interface and User Experience Design Lab",
    attended: 18,
    total: 20,
    slot: "Lab",
    faculty: "Faculty Member",
    upcomingClasses: 4,
  },
  {
    id: 7,
    code: "ISWE401L",
    name: "Deep Learning",
    attended: 26,
    total: 30,
    slot: "F2 + TF2",
    faculty: "Faculty Member",
    upcomingClasses: 6,
  },
];

export function getAttendanceDecimal(attended, total) {
  const a = Number(attended) || 0;
  const t = Number(total) || 0;
  if (t <= 0) return 0;
  return Number(((a / t) * 100).toFixed(2));
}

export function getAttendanceStatus(attended, total) {
  const percentage =
    typeof total === "undefined"
      ? Number(attended) || 0
      : getAttendanceDecimal(attended, total);

  if (percentage >= 90) {
    return { label: "Excellent", tone: "excellent", className: "excellent" };
  }
  if (percentage >= 85) {
    return { label: "Good", tone: "good", className: "good" };
  }
  if (percentage >= 80) {
    return { label: "Average", tone: "average", className: "average" };
  }
  if (percentage >= 75) {
    return { label: "Warning", tone: "warning", className: "warning" };
  }
  return { label: "Critical", tone: "critical", className: "critical" };
}

export function getOverallAttendance(data = attendanceData) {
  const total = data.reduce((sum, item) => sum + (Number(item.total) || 0), 0);
  const attended = data.reduce((sum, item) => sum + (Number(item.attended) || 0), 0);
  const absent = Math.max(0, total - attended);
  const percentage = getAttendanceDecimal(attended, total);

  return { total, attended, absent, missed: absent, percentage };
}
