
import { z } from "zod";

const httpsUrl = z.string().url().refine(
  (value) => {
    try {
      return new URL(value).protocol === "https:";
    } catch {
      return false;
    }
  },
  "URL must use HTTPS.",
);

const repositoryUrl = httpsUrl.refine(
  (value) => {
    const hostname = new URL(value).hostname.toLowerCase();

    return (
      hostname === "github.com" ||
      hostname === "gitlab.com"
    );
  },
  "Repository must be hosted on GitHub or GitLab.",
);

export const createProjectSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(20).max(5000),
  repositoryUrl,
  liveDemoUrl: httpsUrl.optional().or(z.literal("")),
});

export type CreateProjectInput =
  z.infer<typeof createProjectSchema>;
