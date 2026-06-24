export type LoginInput = {
  email: string;
  password: string;
};

export type SessionPayload = {
  userId: string;
  expiresAt: number; // Unix timestamp in ms
};
