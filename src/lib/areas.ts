/** Project areas, in the order the filter chips appear. */
export const projectAreas = ['Web', 'Mobile', 'Desktop', 'Backend', 'Data'] as const;

export type ProjectArea = (typeof projectAreas)[number];
