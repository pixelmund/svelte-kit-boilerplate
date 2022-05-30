<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = function () {
		return {
			stuff: {
				title: 'Set your new password'
			}
		};
	};
</script>

<script lang="ts">
	import { Field, createForm } from '$lib/forms';
	import { object, string } from 'zod';
	import { graphql, mutation } from '$houdini';
	import type { ResetPassword } from '$houdini';
	import { SubmitButton } from '$lib/ui/buttons';
	import { Result } from '$lib/result';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const ResetPasswordSchema = object({
		newPassword: string().min(6),
		confirm: string().min(6)
	}).refine((data) => data.newPassword === data.confirm, {
		message: "Passwords don't match",
		path: ['confirm'] // path of error
	});

	const resetPassword = mutation<ResetPassword>(graphql`
		mutation ResetPassword($input: ResetPasswordInput!) {
			resetPassword(input: $input)
		}
	`);

	const { form, formError, isSubmitting } = createForm({
		schema: ResetPasswordSchema,
		onSubmit: async ({ newPassword }) => {
			const result = await resetPassword({
				input: {
					newPassword,
					code: $page.params.id
				}
			});

			if (result?.resetPassword === Result.SUCCESS) {
				goto('/auth-redirect');
			}
		}
	});
</script>

<form use:form class="space-y-6 w-full" method="POST">
	<Field type="password" name="newPassword" label="New password" />
	<Field type="password" name="confirm" label="Confirm new password" />
	<div>
		{#if $formError}
			<p class="mb-2 text-sm text-red-600">{$formError}</p>
		{/if}
		<SubmitButton isSubmitting={$isSubmitting} full>Reset &amp; sign in</SubmitButton>
	</div>
</form>
