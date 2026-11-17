// Placeholder package. Authentication lives in modules/identity (Better Auth adapter, ADR-010) and authorization
// in modules/organizations (ADR-011). Nothing depends on this package; it is kept until a shared client-side
// auth helper (e.g. for the mobile app) justifies it or it is removed in a cleanup phase.
export const authPackageReady = true;
