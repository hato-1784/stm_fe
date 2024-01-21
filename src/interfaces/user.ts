export interface User {
  username?: string | null;
  email?: string | null;
  sessionId?: string | undefined; // Added this line
}
