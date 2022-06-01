<script lang="ts">
	import { graphql, paginatedQuery } from '$houdini';
	import type { MyNotes } from '$houdini';
	import { filterEdges } from '$lib/utils/pagination';
	import CreateNote from './_create.svelte';
	import Note from './_note.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { BookmarkAlt } from '@steeze-ui/heroicons';
	import InfiniteScroll from '$lib/utils/InfiniteScroll.svelte';
	import { LoadingSpinner } from '$lib/icons';

	const { data, loadNextPage, pageInfo, loading } = paginatedQuery<MyNotes>(graphql`
		query MyNotes {
			notes(first: 6) @paginate(name: "User_Notes") {
				edges {
					node {
						id
						...NoteInfo
					}
				}
			}
		}
	`);

	$: notes = filterEdges($data?.notes.edges);
</script>

<div
	class="w-full flex flex-col flex-1 overflow-x-hidden overflow-y-auto max-h-[326px] space-y-3 mb-6"
>
	{#each notes as note (note.id)}
		<Note {note} />
	{:else}
		<div
			class="relative block w-full border-2 border-gray-300 border-dashed rounded-lg px-12 py-6 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
		>
			<Icon src={BookmarkAlt} class="mx-auto h-12 w-12 text-gray-300" />
			<span class="mt-4 block text-sm font-medium text-gray-900"
				>Looks like this place is empty, start by creating your first note below.</span
			>
		</div>
	{/each}
	{#if notes.length > 5}
		<InfiniteScroll
			threshold={66}
			hasMore={$pageInfo.hasNextPage}
			on:loadMore={async () => await loadNextPage()}
		/>
	{/if}
</div>
<div class="h-4 -mt-4 mb-4">
	<LoadingSpinner
		class="transition-opacity {$loading
			? 'opacity-100'
			: 'opacity-0'} mx-auto w-5 h-5 text-gray-300"
	/>
</div>
<CreateNote />
