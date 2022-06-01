<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = function () {
		return {
			stuff: {
				title: 'Reset your password'
			}
		};
	};
</script>

<script lang="ts">
	import { Field, createForm } from '$lib/forms';
	import { object, string } from 'zod';
	import { graphql, mutation } from '$houdini';
	import type { ForgotPassword } from '$houdini';
	import { SubmitButton, ButtonOrLink } from '$lib/ui/buttons';
	import { Result } from '$lib/utils/result';

	const ForgotPasswordSchema = object({
		email: string().email().min(1)
	});

	const forgotPassword = mutation<ForgotPassword>(graphql`
		mutation ForgotPassword($input: ForgotPasswordInput!) {
			forgotPassword(input: $input)
		}
	`);

	let showSuccessMessage: boolean = false;

	const { form, formError, isSubmitting, reset, setErrors } = createForm({
		schema: ForgotPasswordSchema,
		onSubmit: async ({ email }) => {
			showSuccessMessage = false;

			const result = await forgotPassword({
				input: {
					email
				}
			});

			if (result?.forgotPassword === Result.SUCCESS) {
				showSuccessMessage = true;
				reset();
				setErrors('email', null);
				return;
			}
		}
	});
</script>

<form use:form class="space-y-6 w-full" method="POST">
	<Field type="email" name="email" label="Email address" />
	<div>
		{#if showSuccessMessage}
		<div class="flex justify-between items-center mb-6">
			<p class="text-sm max-w-[220px] text-green-600">
				Check your e-mails for a reset link and follow the instructions.
			</p>
			<ButtonOrLink variant="ghost" size="small" href="/auth/login">
				Login
			</ButtonOrLink>
		</div>
		{/if}
		{#if $formError}
			<p class="mb-2 text-sm text-red-600">{$formError}</p>
		{/if}
		<SubmitButton isSubmitting={$isSubmitting} full>Reset password</SubmitButton>
	</div>
</form>
