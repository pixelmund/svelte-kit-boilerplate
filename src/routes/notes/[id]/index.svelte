<script context="module" lang="ts">
	export function NoteQueryVariables(ctx: any) {
		return {
			id: ctx.params.id
		};
	}

	export function afterLoad(this: any, { data }: NoteQuery$afterLoad) {
		if (!data.NoteQuery || !data.NoteQuery?.note) {
			return this.error(404);
		}

		return {};
	}
</script>

<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		graphql,
		mutation,
		query,
		type DeleteNoteFromView,
		type NoteQuery,
		type NoteQuery$afterLoad
	} from '$houdini';
	import { createForm } from '$lib/forms';
	import TextArea from '$lib/forms/TextArea.svelte';
	import LoadingSpinner from '$lib/icons/LoadingSpinner.svelte';
	import { ButtonOrLink } from '$lib/ui/buttons';
	import { formatDistance } from 'date-fns';
	import { object, string } from 'zod';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { PencilAlt, ArrowLeft } from '@steeze-ui/heroicons';

	let editMode = false;

	const { data } = query<NoteQuery>(graphql`
		query NoteQuery($id: ID!) {
			note(id: $id) {
				id
				text
				createdAt
			}
		}
	`);

	$: note = $data!.note;

	const deleteNote = mutation<DeleteNoteFromView>(
		graphql`
			mutation DeleteNoteFromView($input: DeleteNoteInput!) {
				deleteNote(input: $input) {
					...User_Notes_remove
				}
			}
		`
	);

	async function removeNote() {
		const result = await deleteNote({
			input: {
				id: note.id
			}
		});
		if (result?.deleteNote) {
			goto('/notes');
		}
	}

	const editNote = mutation(graphql`
		mutation EditNote($input: EditNoteInput!) {
			editNote(input: $input) {
				...NoteInfo
			}
		}
	`);

	const { form, isSubmitting } = createForm({
		schema: object({
			text: string().min(1)
		}),
		initialValues: {
			text: $data!.note.text
		},
		onSubmit: async ({ text }) => {
			await editNote({
				input: {
					id: note.id,
					text
				}
			});
			editMode = false;
		}
	});
</script>

<div class="flex-1 flex flex-col w-full">
	<div class="flex items-center justify-between">
		<ButtonOrLink
			href="/notes"
			class="w-12 h-12 rounded-full justify-center !bg-gray-50 !border-none"
			variant="ghost"
		>
			<Icon src={ArrowLeft} class="w-5 h-5 flex-shrink-0" />
		</ButtonOrLink>
		<span>
			<p class="text-gray-600">
				{formatDistance(note.createdAt, new Date(), { addSuffix: true })}
			</p>
		</span>
	</div>
	<div class="my-auto">
		{#if editMode}
			<form class="w-full flex relative" use:form method="POST">
				<TextArea name="text" class="!rounded-xl !pr-20" />
				<button
					type="submit"
					class="absolute h-full right-0 top-1/2 transform -translate-y-1/2 inline-flex items-center p-4 border border-transparent rounded-r-xl shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
				>
					{#if $isSubmitting}
						<LoadingSpinner class="h-5 w-5" />
					{:else}
						<Icon src={PencilAlt} class="w-5 h-5" />
					{/if}
				</button>
			</form>
		{:else}
			<h1 class="text-xl font-semibold">{note.text}</h1>
		{/if}
	</div>
	<div class="mt-auto flex flex-col sm:flex-row items-center gap-4">
		{#if !editMode}
			<ButtonOrLink on:click={() => (editMode = true)} full variant="primary">Edit</ButtonOrLink>
			<ButtonOrLink on:click={removeNote} full variant="ghost">Delete</ButtonOrLink>
		{/if}
	</div>
</div>
