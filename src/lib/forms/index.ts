/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { writable } from 'svelte/store';
import { createForm as createFelteForm } from 'felte';

import { reporter } from '@felte/reporter-svelte';
import { validator } from '@felte/validator-zod';

export { default as Field } from './Field.svelte';
export { default as Label } from './Label.svelte';
export { default as Input } from './TextInput.svelte';
export { default as TextArea } from './TextArea.svelte';
export { default as Form } from './Form.svelte';

type OnSubmit<T extends Zod.ZodSchema> = (data: Zod.infer<T>) => void | Promise<void>;

type RecursivePartial<T extends Record<string, any>> = {
	[P in keyof T]?: T[P] extends Record<string, any> | Array<any> ? RecursivePartial<T[P]> : T[P];
};

interface FormProps<T extends Zod.ZodSchema> {
	schema: T;
	onSubmit: OnSubmit<T>;
	onError?: (error: any) => any;
	initialValues?: RecursivePartial<Zod.infer<T>>;
}

export function createForm<T extends Zod.ZodSchema>(options: FormProps<T>) {
	const formError = writable<string | null>(null);

	const form = createFelteForm({
		onSubmit: async function (data) {
			formError.set(null);
			await options.onSubmit(data);
		},
		onError: (err: any) => {
			if (!err) return;

			if (options.onError) {
				options.onError(err);
			}

			if (err && Array.isArray(err)) {
				for (let index = 0; index < err.length; index++) {
					const error = err[index];
					if (error && error.extensions && error.extensions.properties) {
						for (const key in error.extensions.properties) {
							const prop = error.extensions.properties[key];
							form.setErrors(key as any, prop);
						}
					}
				}
				return;
			}

			formError.set(err.message);
			return;
		},
		initialValues: options.initialValues,
		// @ts-ignore
		extend: options.schema ? [validator({ schema: options.schema }), reporter()] : [reporter]
	});

	return {
		...form,
		formError
	};
}
