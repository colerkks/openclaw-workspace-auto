
// Mock implementation of Drizzle for demo purposes without DB connection
import * as schema from './schema';

// Helper to create mock chainable query builders
const createMockQueryBuilder = (mockData: any = []) => {
  const builder = {
    select: () => builder,
    from: () => builder,
    where: () => builder,
    limit: () => builder,
    offset: () => builder,
    orderBy: () => builder,
    leftJoin: () => builder,
    rightJoin: () => builder,
    innerJoin: () => builder,
    insert: () => builder,
    values: () => builder,
    update: () => builder,
    set: () => builder,
    delete: () => builder,
    returning: () => {
        // Return mock data based on the operation context if needed
        // For insert/update, usually returns the modified rows
        return Promise.resolve(Array.isArray(mockData) ? mockData : [mockData]);
    },
    then: (resolve: Function) => {
      return Promise.resolve(mockData).then(resolve as any);
    },
    execute: () => Promise.resolve(mockData),
  };
  return builder;
};

// Mock DB instance
export const mockDb = {
  select: () => createMockQueryBuilder([]),
  insert: () => createMockQueryBuilder({ id: 1, ...schema }),
  update: () => createMockQueryBuilder([]),
  delete: () => createMockQueryBuilder([]),
  query: {
    users: {
      findFirst: () => Promise.resolve({ id: 1, email: 'demo@lams-fm.com' }),
      findMany: () => Promise.resolve([]),
    },
    fmProfiles: {
      findFirst: () => Promise.resolve({ id: 1, userId: 1 }),
      findMany: () => Promise.resolve([]),
    },
    // Add other tables as needed
  },
  transaction: (callback: (tx: any) => Promise<any>) => callback(mockDb),
} as any;
