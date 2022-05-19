/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExecutionResult } from 'graphql';
import { GraphQLError } from 'graphql';

function getGraphQLCode(error: Error & { code?: number }) {
	return error?.code ?? error?.name === 'NotFoundError' ? 404 : null;
}

export function formatResult(result: ExecutionResult) {
	const formattedResult: ExecutionResult = {
		data: result.data
	};

	if (result.errors) {
		formattedResult.errors = result.errors.map((error) => {
			// NOTE: If you need to debug a specific server-side GraphQL error, you may want to uncomment this log:
			// console.log(error.originalError);

			// Return a generic error message instead
			return new GraphQLError(error.message, {
				nodes: error.nodes,
				source: error.source,
				positions: error.positions,
				path: error.path,
				originalError: error.originalError,
				extensions: {
					code: getGraphQLCode(error.originalError as any),
					path: (error.originalError as any)?.path,
					...(error.originalError as any)?.extensions
				}
			});
		});
	}

	return formattedResult;
}
