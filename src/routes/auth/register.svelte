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
	import { Field, createForm } from '$lib/forms';
	import { object, string } from 'zod';
	import { graphql, mutation } from '$houdini';
	import type { SignUp } from '$houdini';
	import SubmitButton from '$lib/ui/buttons/SubmitButton.svelte';
	import { goto } from '$app/navigation';

	const SignUpSchema = object({
		name: string().nonempty(),
		email: string().email().nonempty(),
		password: string().min(6).nonempty()
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
			goto('/auth-redirect');
		}
	});
</script>

<form use:form class="space-y-6" method="POST">
	<Field type="text" name="name" label="Name" />
	<Field type="email" name="email" label="Email address" />
	<Field type="password" name="password" label="Password" />
	<div>
		{#if $formError}
			<p class="mb-2 text-sm text-red-600">{$formError}</p>
		{/if}
		<SubmitButton isSubmitting={$isSubmitting} full>Sign up</SubmitButton>
	</div>
</form>
