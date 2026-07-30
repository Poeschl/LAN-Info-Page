declare module "#auth-utils" {
  interface User {
    username: string;
    email: string;
    roles: string[];
  }
}

export {};
