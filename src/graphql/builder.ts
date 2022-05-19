import SchemaBuilder from '@pothos/core';
import RelayPlugin from '@pothos/plugin-relay';
import PrismaPlugin from '@pothos/plugin-prisma';
import ScopeAuthPlugin from '@pothos/plugin-scope-auth';
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects';
import ValidationPlugin from '@pothos/plugin-validation';
import { db } from '$lib/db';
import type PrismaTypes from '../prisma/_generated_types_';

export type SchemaBuilderContext = {
	PrismaTypes: PrismaTypes;
	Scalars: {
		// We modify the types for the `ID` type to denote that it's always a string when it comes in.
		ID: { Input: string; Output: string | number };
		DateTime: { Input: Date; Output: Date };
	};
	DefaultInputFieldRequiredness: true;
	Context: GraphqlContext;
	// Define the shape of the auth scopes that we'll be using:
	AuthScopes: {
		public: boolean;
		user: boolean;
		unauthenticated: boolean;
	};
};

export const builder = new SchemaBuilder<SchemaBuilderContext>({
	defaultInputFieldRequiredness: true,
	plugins: [ScopeAuthPlugin, PrismaPlugin, SimpleObjectsPlugin, ValidationPlugin, RelayPlugin],
	authScopes: async ({ userId }) => ({
		public: true,
		user: !!userId,
		unauthenticated: !userId
	}),
	relayOptions: {
		clientMutationId: 'omit',
		cursorType: 'String'
	},
	prisma: {
		client: db
	}
});

// This ./builderzes the query and mutation types so that we can add fields to them dynamically:
builder.queryType({
	authScopes: {
		user: true
	}
});
builder.mutationType({
	authScopes: {
		user: true
	}
});

// Provide the custom DateTime scalar that allows dates to be transmitted over GraphQL:
builder.scalarType('DateTime', {
	serialize: (date) => date.toISOString(),
	parseValue: (date) => {
		if (typeof date !== 'string') {
			throw new Error('Unknown date value.');
		}

		return new Date(date);
	}
});

import('./');
