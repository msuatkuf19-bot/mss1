declare module '@prisma/client' {
  export enum DemoRequestStatus {
    PENDING = 'PENDING',
    CONTACTED = 'CONTACTED',
    DEMO_CREATED = 'DEMO_CREATED',
    CANCELLED = 'CANCELLED',
  }

  // Ensure TS language service sees the generated delegate.
  // Runtime types come from Prisma generate; this is only for editor compatibility.
  interface PrismaClient {
    demoRequest: any;
  }
}
