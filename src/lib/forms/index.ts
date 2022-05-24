/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { writable } from 'svelte/store';
import { createForm as createFelteForm } from 'felte';
import type { ValidatorConfig } from '@felte/validator-zod';

import { reporter } from '@felte/reporter-svelte';
import { validator } from '@felte/validator-zod';

export { default as Field } from './Field.svelte';
export { default as Label } from './Label.svelte';
export { default as Input } from './TextInput.svelte';

type OnSubmit<T extends Zod.ZodSchema> = (data: Zod.infer<T>) => void | Promise<void>;

type RecursivePartial<T extends Record<string, any>> = {
	[P in keyof T]?: T[P] extends Record<string, any> | Array<any> ? RecursivePartial<T[P]> : T[P];
};

interface FormProps<T extends Zod.ZodSchema> {
	schema: T;
	onSubmit: OnSubmit<T>;
	initialValues?: RecursivePartial<Zod.infer<T>>;
}

export function createForm<T extends Zod.ZodSchema>(options: FormProps<T>) {
	const formError = writable<string | null>(null);

	const form = createFelteForm<T, ValidatorConfig>({
		onSubmit: async function (data) {
			formError.set(null);
			await options.onSubmit(data);
		},
		onError: (err: any) => {
			if (!err) return;
			if (!Array.isArray(err)) {
				formError.set(err.message);
				return;
			}
			formError.set(err[0].message);
		},
		initialValues: options.initialValues,
		// @ts-ignore
		extend: options.schema ? [validator({ schema: options.schema }), reporter] : [reporter]
	});

	return {
		...form,
		formError
	};
}
