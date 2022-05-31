<script lang="ts">
	import { graphql, paginatedQuery } from '$houdini';
	import type { MyNotes } from '$houdini';
	import { filterEdges } from '$lib/pagination';
	import CreateNote from './_create.svelte';
	import Note from './_note.svelte';

	const { data, loadNextPage, loadPreviousPage, pageInfo } = paginatedQuery<MyNotes>(graphql`
		query MyNotes {
			notes(first: 10) @paginate(name: "User_Notes") {
				edges {
					node {
						id
						...NoteInfo
					}
				}
			}
		}
	`);

	$: console.log($data);
	$: notes = filterEdges($data?.notes.edges);
</script>

<div class="w-full flex flex-col flex-1 space-y-3 mb-6">
	{#each notes as note (note.id)}
		<Note {note} />
	{/each}
</div>
<CreateNote />
