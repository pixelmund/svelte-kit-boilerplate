<script lang="ts">
	import { Field, createForm } from '$lib/forms';
	import { object, string } from 'zod';
	import { graphql, mutation } from '$houdini';
	import type { SignUp } from '$houdini';

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

	const { form, formError } = createForm({
		schema: SignUpSchema,
		onSubmit: async ({ email, password, name }) => {
			await signUp({
				input: {
					name,
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
		<h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
	</div>

	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			<form use:form class="space-y-6" method="POST">
				<Field type="text" name="name" label="Name" />
				<Field type="email" name="email" label="Email address" />
				<Field type="password" name="password" label="Password" />
				<div>
					{#if $formError}
						<p class="mb-2 text-sm text-red-600">{$formError}</p>
					{/if}
					<button
						type="submit"
						class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>Sign up</button
					>
				</div>
			</form>
		</div>
	</div>
</div>
