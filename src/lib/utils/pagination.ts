export type Edge<T> = {
	node: T;
} | null;

export type Truthy<T> = T extends false | '' | 0 | null | undefined ? never : T;

function truthy<T>(value: T): value is Truthy<T> {
	return !!value;
}

export function filterEdges<T>(edges?: Edge<T>[]): T[] {
	if (!edges) return [];
	return edges.filter(truthy).map((edge) => edge.node);
}
