<script lang="ts">
	import { fragment, graphql, mutation } from '$houdini';
	import type { NoteInfo, DeleteNote } from '$houdini';

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
		await deleteNote({
			input: {
				id: $data!.id
			}
		});
	}
</script>

{#if $data}
	<div class="relative w-full rounded-md py-3 pl-3 pr-12 bg-gray-100">
		<p class="text-gray-900">{$data.text}</p>
		<button
			class="text-gray-400 hover:text-gray-600 absolute right-4 top-1/2 transform -translate-y-1/2 transition-colors"
			on:click={removeNote}
		>
			<svg
				class="w-6 h-6"
				fill="none"
				stroke="currentColor"
				viewBox="0 0 24 24"
				xmlns="http://www.w3.org/2000/svg"
				><path
					stroke-linecap="round"
					stroke-linejoin="round"
					stroke-width="2"
					d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
				/></svg
			>
		</button>
	</div>
{/if}
