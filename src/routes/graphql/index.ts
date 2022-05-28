import type { RequestEvent } from '@sveltejs/kit';
import {
	getGraphQLParameters,
	processRequest,
	renderGraphiQL,
	shouldRenderGraphiQL
} from 'graphql-helix';
import { schema } from '$graphql';
import { formatResult } from './_utils';

async function graphqlHandler(event: RequestEvent) {
	const { url, locals, request } = event;

	const graphqlRequest = {
		headers: request.headers,
		method: request.method,
		body: request.method === 'GET' ? null : await request.json(),
		query: request.method === 'GET' ? Object.fromEntries(url.searchParams) : {}
	};

	if (shouldRenderGraphiQL(graphqlRequest)) {
		return {
			body: renderGraphiQL(),
			headers: { 'Content-Type': 'text/html' },
			status: 200
		};
	}

	const parameters = getGraphQLParameters(graphqlRequest);
	const sessionData = await locals.session.data();

	const result = await processRequest<GraphqlContext, unknown>({
		...parameters,
		// For example, auth information is put in context for the resolver
		contextFactory: () => ({
			locals,
			event,
			userId: sessionData?.userId
		}),
		request: graphqlRequest,
		schema
	});

	if (result.type !== 'RESPONSE') {
		throw new Error(`Unsupported response type: "${result.type}"`);
	}

	const headers = new Headers(result.headers.map(({ name, value }) => [name, value]));

	return {
		status: result.status,
		headers,
		body: formatResult(result.payload)
	};
}

export const post = graphqlHandler;
export const get = graphqlHandler;
