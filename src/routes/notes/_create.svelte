<script lang="ts">
	import type { CreateNote } from '$houdini';
	import { object, string } from 'zod';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Plus } from '@steeze-ui/heroicons';
	import { graphql, mutation } from '$houdini';
	import { createForm, Input as TextInput, Form } from '$lib/forms';
	import { LoadingSpinner } from '$lib/icons';

	const createNote = mutation<CreateNote>(graphql`
		mutation CreateNote($input: CreateNoteInput!) {
			createNote(input: $input) {
				id
				...User_Notes_insert @prepend
			}
		}
	`);

	const { form, isSubmitting, reset } = createForm({
		initialValues: {},
		schema: object({
			text: string().min(1)
		}),
		onSubmit: async ({ text }) => {
			// we generate an id on the client so we can provide an optimistic response
			const id = crypto.randomUUID();
			// Because of pothos encoding ids to base64 we have to handle it here:
			const base64_id = window.btoa(`Note:${id}`);

			await createNote(
				{ input: { text, id } },
				{
					optimisticResponse: {
						// @ts-ignore
						createNote: { id: base64_id, text, createdAt: new Date() }
					}
				}
			);

			reset();
		}
	});
</script>

<Form class="w-full flex relative" {form} {isSubmitting}>
	<TextInput name="text" class="rounded-xl" />
	<button
		type="submit"
		class="absolute right-0 top-1/2 transform -translate-y-1/2 inline-flex items-center p-2 border border-transparent rounded-r-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
	>
		{#if $isSubmitting}
			<LoadingSpinner class="h-5 w-5" />
		{:else}
			<Icon src={Plus} class="h-5 w-5" />
		{/if}
	</button>
</Form>
