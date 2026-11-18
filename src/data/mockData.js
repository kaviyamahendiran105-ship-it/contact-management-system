/**
 * Initial dataset for CallPulse Contact & Communication Directory
 */

export const people = [
  ["Priya Sharma", "Product Designer", "Work", "+1 (555) 234-5678", "priya.sharma", "coral", true],
  ["Arjun Mehta", "Brother", "Family", "+1 (555) 987-6543", "arjun.mehta", "blue", true],
  ["Karan Malhotra", "Account Manager", "Clients", "+1 (555) 876-5432", "karan.malhotra", "green", false],
  ["Neha Verma", "Marketing Lead", "Work", "+1 (555) 345-6789", "neha.verma", "gold", false],
  ["Tech Support", "Customer Service", "Helpdesk", "+1 (800) 555-0199", "support", "violet", false],
  ["Anita Mehta", "Mother", "Family", "+1 (555) 222-1098", "anita.mehta", "coral", true],
  ["Rohan Kapoor", "Engineering Lead", "Work", "+1 (555) 290-1182", "rohan.kapoor", "blue", false],
  ["Meera Iyer", "Recruiter", "Work", "+1 (555) 301-8842", "meera.iyer", "green", false],
  ["Aarav Singh", "Photographer", "Clients", "+1 (555) 412-6731", "aarav.singh", "gold", false],
  ["Sana Khan", "Brand Strategist", "Clients", "+1 (555) 501-2234", "sana.khan", "violet", false],
];

/**
 * Generates initial contacts with 10 directory members
 */
export const initialContacts = people.map((person, index) => {
  const name = person[0];
  const initials = initialsFor(name);
  return {
    id: index + 1,
    name,
    role: person[1],
    group: person[2],
    phone: person[3],
    email: `${person[4]}@example.com`,
    initials,
    color: person[5],
    favorite: Boolean(person[6]),
    spam: false,
    lastContacted: "Recently active",
  };
});

/**
 * Initial call log records
 */
export const initialCalls = [
  {
    id: 1,
    type: "incoming",
    name: "Priya Sharma",
    group: "Work",
    phone: "+1 (555) 234-5678",
    date: "Today, 11:45 AM",
    duration: "4m 12s",
  },
  {
    id: 2,
    type: "outgoing",
    name: "Karan Malhotra",
    group: "Clients",
    phone: "+1 (555) 876-5432",
    date: "Today, 10:15 AM",
    duration: "8m 30s",
  },
  {
    id: 3,
    type: "missed",
    name: "Unknown Caller",
    group: "Unsaved",
    phone: "+1 (555) 789-0123",
    date: "Yesterday, 6:04 PM",
    duration: "Missed (0s)",
  },
  {
    id: 4,
    type: "incoming",
    name: "Arjun Mehta",
    group: "Family",
    phone: "+1 (555) 987-6543",
    date: "Yesterday, 1:20 PM",
    duration: "14m 05s",
  },
];

export const navigationItems = ["Contacts", "Call History", "Favorites"];

export const callFilters = [
  { key: "all", label: "All Calls" },
  { key: "incoming", label: "Incoming" },
  { key: "outgoing", label: "Outgoing" },
  { key: "missed", label: "Missed" },
];

/**
 * Extracts 2-letter uppercase initials safely from any name string
 */
export function initialsFor(name) {
  if (!name || typeof name !== "string") return "--";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "--";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
