import { builder } from '../builder';

export enum Result {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE'
}

builder.enumType(Result, { name: 'Result' });
