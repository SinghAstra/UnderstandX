import APP_PATHS from "@/config/path.config";
import { PackageSearch } from "lucide-react";

export const nonUserNavbar = [
  { id: 1, label: "Explore jobs", path: APP_PATHS.JOBS },
  { id: 2, label: "Contact us", path: APP_PATHS.CONTACT_US },
];

export const userNavbar = [
  { id: 1, label: "Explore jobs", path: APP_PATHS.JOBS },
  { id: 2, label: "Contact us", path: APP_PATHS.CONTACT_US },
];
export const adminNavbar = [
  { id: 1, label: "Explore jobs", path: APP_PATHS.JOBS },
  {
    id: 2,
    label: "Manage Jobs",
    path: APP_PATHS.MANAGE_JOBS,
    roleRequired: ["ADMIN", "HR"],
    icon: PackageSearch,
  },
  {
    id: 3,
    label: "Post a job",
    path: APP_PATHS.POST_JOB,
    roleRequired: ["ADMIN", "HR"],
    icon: PackageSearch,
  },
];
