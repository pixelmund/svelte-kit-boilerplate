<script lang="ts">
	import { object, string } from 'zod';
	import { graphql, mutation, type VerifyPassword } from '$houdini';
	import { createForm, Form, Field } from '$lib/forms';
	import { Result } from '$lib/utils/result';
	import { Modal, ModalDescription, ModalTitle } from '$lib/modals';
	import { SubmitButton, Button } from '$lib/ui/buttons';

	export let isOpen: boolean = false;
	export let onVerified: (verified: boolean) => void;
	export let description: string = 'To unlock this feature, you must confirm your password first.';

	let id = 'confirm_password_modal_' + Math.random().toString(36).substring(1, 8);

	const { form, isSubmitting, formError } = createForm({
		schema: object({
			verifiedPassword: string().min(6)
		}),
		initialValues: {},
		onSubmit: async ({ verifiedPassword }) => {
			const result = await verifyPassword({ password: verifiedPassword });

			if (result?.verifyPassword === Result.SUCCESS) {
				onVerified(true);
			} else {
				onVerified(false);
			}
		},
		onError: (error) => {
			onVerified(false);
		}
	});

	const verifyPassword = mutation<VerifyPassword>(graphql`
		mutation VerifyPassword($password: String!) {
			verifyPassword(password: $password)
		}
	`);
</script>

<Modal bind:isOpen>
	<svelte:fragment>
		<Form {id} method="POST" {form} {isSubmitting}>
			<ModalTitle>Confirm your password</ModalTitle>
			<ModalDescription class="mt-4 text-sm text-gray-500">
				{description}
			</ModalDescription>
			<Field
				containerClass="mt-6"
				name="verifiedPassword"
				label="Current password"
				type="password"
			/>
			{#if $formError}
				<p class="mt-4 mb-2 text-sm text-red-600">{$formError}</p>
			{/if}
		</Form>
	</svelte:fragment>
	<svelte:fragment slot="footer">
		<SubmitButton
			form={id}
			isSubmitting={$isSubmitting}
			type="submit"
			class="mr-3 sm:mr-0 sm:ml-3"
			variant="primary">Unlock</SubmitButton
		>
		<Button type="button" variant="ghost" on:click={() => (isOpen = false)}>Close</Button>
	</svelte:fragment>
</Modal>
