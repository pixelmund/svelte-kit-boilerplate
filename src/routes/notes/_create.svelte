<script lang="ts">
	import { graphql, mutation } from '$houdini';
	import type { CreateNote } from '$houdini';
	import { object, string } from 'zod';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Plus } from '@steeze-ui/heroicons';
	import { createForm } from '$lib/forms';
	import TextInput from '$lib/forms/TextInput.svelte';
	import LoadingSpinner from '$lib/icons/LoadingSpinner.svelte';

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
			<LoadingSpinner class="h-5 w-5" />
		{:else}
			<Icon src={Plus} class="h-5 w-5" />
		{/if}
	</button>
</form>
