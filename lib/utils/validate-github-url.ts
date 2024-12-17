const GITHUB_URL_REGEX =
  /^https?:\/\/github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+\/?$/;

export function validateGithubUrl(url: string): {
  isValid: boolean;
  error?: string;
} {
  if (!url) {
    return { isValid: false, error: "Please enter a GitHub repository URL" };
  }

  try {
    const urlObj = new URL(url);

    if (!GITHUB_URL_REGEX.test(url)) {
      return {
        isValid: false,
        error:
          "Please enter a valid GitHub repository URL (e.g., https://github.com/username/repository)",
      };
    }

    const [username, repo] = urlObj.pathname.split("/").filter(Boolean);
    if (!username || !repo) {
      return {
        isValid: false,
        error: "URL must contain both username and repository name",
      };
    }

    return { isValid: true };
  } catch {
    return {
      isValid: false,
      error: "Please enter a valid URL",
    };
  }
}
