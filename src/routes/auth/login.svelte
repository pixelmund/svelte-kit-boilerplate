<script lang="ts">
	import { Field, createForm } from '$lib/forms';
	import { object, string } from 'zod';
	import { graphql, mutation } from '$houdini';
	import type { SignIn } from '$houdini';

	const LoginSchema = object({
		email: string().email().nonempty(),
		password: string().min(6).nonempty()
	});

	const signIn = mutation<SignIn>(graphql`
		mutation SignIn($input: LoginInput!) {
			login(input: $input) {
				id
				email
				name
			}
		}
	`);

	const { form, formError, isSubmitting } = createForm({
		schema: LoginSchema,
		onSubmit: async ({ email, password }) => {
			await signIn({
				input: {
					email,
					password
				}
			});
			window.location.href = '/';
		}
	});
</script>

<div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<img
			class="mx-auto h-12 w-auto"
			src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
			alt="Workflow"
		/>
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to your account</h2>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<form use:form class="space-y-6" method="POST">
				<Field type="email" name="email" label="Email address" />
				<Field type="password" name="password" label="Password" />
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<input
							id="remember-me"
							name="remember-me"
							type="checkbox"
							class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
						/>
						<label for="remember-me" class="ml-2 block text-sm text-gray-900"> Remember me </label>
					</div>

					<div class="text-sm">
						<a
							href="/auth/forgot-password"
							class="font-medium text-indigo-600 hover:text-indigo-500"
						>
							Forgot your password?
						</a>
					</div>
				</div>

				<div>
					{#if $formError}
						<p class="mb-2 text-sm text-red-600">{$formError}</p>
					{/if}
					<button
						type="submit"
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
					>
						{#if $isSubmitting}
							<svg
								class="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									class="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									stroke-width="4"
								/>
								<path
									class="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
						{/if}
						Sign in
					</button>
				</div>
			</form>
		</div>
	</div>
</div>
