export function getRelativeTimeString(date: Date | number): string {
  const dateObject = date instanceof Date ? date : new Date(date);

  // Validate if date is valid
  if (isNaN(dateObject.getTime())) {
    throw new Error("Invalid date");
  }

  const timeMs = dateObject.getTime();
  const deltaSeconds = Math.round((timeMs - Date.now()) / 1000);
  const deltaMinutes = Math.round(deltaSeconds / 60);
  const deltaHours = Math.round(deltaMinutes / 60);
  const deltaDays = Math.round(deltaHours / 24);
  const deltaWeeks = Math.round(deltaDays / 7);
  const deltaMonths = Math.round(deltaDays / 30);
  const deltaYears = Math.round(deltaDays / 365);

  if (Math.abs(deltaSeconds) < 60) {
    return "just now";
  } else if (Math.abs(deltaMinutes) < 60) {
    return `${Math.abs(deltaMinutes)} minutes ago`;
  } else if (Math.abs(deltaHours) < 24) {
    return `${Math.abs(deltaHours)} hours ago`;
  } else if (Math.abs(deltaDays) < 7) {
    return `${Math.abs(deltaDays)} days ago`;
  } else if (Math.abs(deltaWeeks) < 4) {
    return `${Math.abs(deltaWeeks)} weeks ago`;
  } else if (Math.abs(deltaMonths) < 12) {
    return `${Math.abs(deltaMonths)} months ago`;
  } else {
    return `${Math.abs(deltaYears)} years ago`;
  }
}
