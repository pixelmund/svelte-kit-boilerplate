<script lang="ts">
	import { graphql, mutation } from '$houdini';
	import type { CreateNote } from '$houdini';
	import { object, string } from 'zod';

	import { createForm } from '$lib/forms';
	import TextInput from '$lib/forms/TextInput.svelte';

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
			await createNote({ input: { text } });
			reset();
		}
	});
</script>

<form class="w-full flex relative" use:form method="POST">
	<TextInput name="text" class="rounded-xl" />
	<button
		type="submit"
		class="absolute right-0 top-1/2 transform -translate-y-1/2 inline-flex items-center p-2 border border-transparent rounded-r-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
	>
		{#if $isSubmitting}
			<svg
				class="animate-spin h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				/>
			</svg>
		{:else}
			<svg
				class="h-5 w-5"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
					clip-rule="evenodd"
				/>
			</svg>
		{/if}
	</button>
</form>
