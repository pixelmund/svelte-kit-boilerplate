<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = function () {
		return {
			stuff: {
				title: 'Create an account'
			}
		};
	};
</script>

<script lang="ts">
	import { Field, createForm, Form } from '$lib/forms';
	import { object, string } from 'zod';
	import { graphql, mutation } from '$houdini';
	import type { SignUp } from '$houdini';
	import SubmitButton from '$lib/ui/buttons/SubmitButton.svelte';
	import { goto } from '$app/navigation';

	let showVerifyEmailMessage = false;

	const SignUpSchema = object({
		name: string().min(1),
		email: string().email().min(1),
		password: string().min(6)
	});

	const signUp = mutation<SignUp>(graphql`
		mutation SignUp($input: SignUpInput!) {
			signUp(input: $input) {
				id
				email
				name
			}
		}
	`);

	const { form, formError, isSubmitting } = createForm({
		schema: SignUpSchema,
		onSubmit: async ({ email, password, name }) => {
			await signUp({
				input: {
					name,
					email,
					password
				}
			});

			if (import.meta.env.VITE_ENABLE_EMAIL_VERIFICATION === 'true') {
				showVerifyEmailMessage = true;
			} else {
				goto('/auth-redirect');
			}
		}
	});
</script>

<Form {form} {isSubmitting} class="space-y-6 w-full" method="POST">
	<Field type="text" name="name" label="Name" />
	<Field type="email" name="email" label="Email address" />
	<Field type="password" name="password" label="Password" />
	<div>
		{#if showVerifyEmailMessage}
			<p class="mb-2 text-sm text-green-600">
				You need to verify your email to finish signing up for Skytro. Please check your Inbox.
			</p>
		{/if}
		{#if $formError}
			<p class="mb-2 text-sm text-red-600">{$formError}</p>
		{/if}
		<SubmitButton isSubmitting={$isSubmitting} full>Sign up</SubmitButton>
	</div>
</Form>
