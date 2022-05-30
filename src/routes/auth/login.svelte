<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = function () {
		return {
			stuff: {
				title: 'Sign in'
			}
		};
	};
</script>

<script lang="ts">
	import { Field, createForm } from '$lib/forms';
	import { object, string } from 'zod';
	import { graphql, mutation } from '$houdini';
	import type { SignIn } from '$houdini';
	import { SubmitButton } from '$lib/ui/buttons';
	import { goto } from '$app/navigation';

	const LoginSchema = object({
		email: string().email().min(1),
		password: string().min(6)
	});

	const signIn = mutation<SignIn>(graphql`
		mutation SignIn($input: LoginInput!) {
			login(input: $input) {
				id
				email
				name
				emailVerified
			}
		}
	`);

	const { form, formError, isSubmitting } = createForm({
		schema: LoginSchema,
		onSubmit: async ({ email, password }) => {
			const result = await signIn({
				input: {
					email,
					password
				}
			});
			if (!result) return;
			if (import.meta.env.VITE_ENABLE_EMAIL_VERIFICATION === 'true') {
				if (!result.login.emailVerified) {
					formError.set('Please verify your email address');
				} else {
					goto('/auth-redirect');
				}
			} else {
				goto('/auth-redirect');
			}
		}
	});
</script>

<form use:form class="space-y-6 w-full" method="POST">
	<Field type="email" name="email" label="Email address" />
	<Field type="password" name="password" label="Password" />
	<div class="flex items-center justify-between">
		<div class="text-sm">
			<a href="/auth/forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">
				Forgot your password?
			</a>
		</div>
	</div>

	<div>
		{#if $formError}
			<p class="mb-2 text-sm text-red-600">{$formError}</p>
		{/if}
		<SubmitButton isSubmitting={$isSubmitting} full>Sign in</SubmitButton>
	</div>
</form>
