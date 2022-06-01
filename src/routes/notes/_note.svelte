<script lang="ts">
	import { fragment, graphql, mutation } from '$houdini';
	import type { NoteInfo, DeleteNote } from '$houdini';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { Trash } from '@steeze-ui/heroicons';

	export let note: NoteInfo;

	const data = fragment(
		graphql`
			fragment NoteInfo on Note {
				id
				text
				createdAt
			}
		`,
		note
	);

	const deleteNote = mutation<DeleteNote>(
		graphql`
			mutation DeleteNote($input: DeleteNoteInput!) {
				deleteNote(input: $input) {
					...User_Notes_remove
				}
			}
		`
	);

	async function removeNote() {
		await deleteNote(
			{
				input: {
					id: $data!.id
				}
			},
			// @ts-expect-error
			{ optimisticResponse: { deleteNote: { id: $data!.id } } }
		);
	}
</script>

{#if $data}
	<div class="relative w-full rounded-md py-3 pl-3 pr-12 bg-gray-100">
		<a href="/notes/{$data.id}" class="text-gray-900 flex items-center">
			<span class="inline-block w-72 truncate">{$data.text}</span>
		</a>
		<button
			class="text-gray-400 hover:text-gray-600 absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
			on:click={removeNote}
		>
			<Icon src={Trash} class="w-6 h-6" />
		</button>
	</div>
{/if}
