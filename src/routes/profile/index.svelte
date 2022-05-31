<script lang="ts">
	import { graphql, mutation, query, type ProfileQuery, type UpdateProfile } from '$houdini';
	import { createForm } from '$lib/forms';
	import Field from '$lib/forms/Field.svelte';
	import Button from '$lib/ui/buttons/Button.svelte';
	import SubmitButton from '$lib/ui/buttons/SubmitButton.svelte';
	import { Modal, ModalTitle, ModalDescription } from '$lib/ui/modals';
	import { object, string } from 'zod';

	let canUpdatePassword: boolean = false;
	let confirmPasswordModalOpen = false;

	const { data } = query<ProfileQuery>(graphql`
		query ProfileQuery {
			me {
				id
				name
				email
			}
		}
	`);

	const updateProfile = mutation<UpdateProfile>(graphql`
		mutation UpdateProfile($input: EditUserInput!) {
			editUser(input: $input) {
				id
				name
				email
			}
		}
	`);

	const { form } = createForm({
		schema: object({
			name: string().min(1),
			email: string().email().min(1)
		}),
		initialValues: {
			name: $data?.me?.name ?? undefined,
			email: $data?.me?.email ?? undefined
		},
		onSubmit: async ({ name }) => {
			await updateProfile({ input: { name } });
		}
	});
</script>

{#if $data && $data.me}
	<h2 class="mb-2 text-3xl text-center font-extrabold text-gray-800">Profile</h2>
	<form use:form class="w-full space-y-8 divide-y divide-gray-200">
		<div class="space-y-8 divide-y divide-gray-200 sm:space-y-5">
			<div>
				<div class="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
					<Field
						containerClass="sm:border-t sm:border-gray-200 sm:pt-5"
						name="name"
						type="text"
						label="Name"
						autocomplete="given-name"
					/>
					<Field
						containerClass="sm:border-t sm:border-gray-200 sm:pt-5"
						name="email"
						type="email"
						label="E-Mail"
						disabled
						autocomplete="email"
					/>
					<div class="relative">
						<div
							class="flex items-center justify-between absolute bottom-0 right-0 left-0 z-10 h-[38px] pl-2 pr-1 rounded-md overflow-hidden"
							class:pointer-events-none={canUpdatePassword}
						>
							{#if !canUpdatePassword}
								<p class="block mb-0 leading-none mt-1">********</p>
							{/if}
							<Button
								on:click={() => (confirmPasswordModalOpen = !confirmPasswordModalOpen)}
								variant="ghost"
								size="small"
								class="ml-auto pointer-events-auto !py-1.5 !px-2 !bg-white"
							>
								{#if canUpdatePassword}
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
										/></svg
									>
								{:else}
									<svg
										class="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
										><path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
										/></svg
									>
								{/if}
							</Button>
						</div>
						<Field
							containerClass="sm:border-t sm:border-gray-200 sm:pt-5"
							name="password"
							type="password"
							label="Password"
							disabled={!canUpdatePassword}
							autocomplete="new-password"
						/>
					</div>
				</div>
			</div>
		</div>
		<div class="pt-5">
			<div class="flex justify-end">
				<SubmitButton isSubmitting={false}>Save</SubmitButton>
			</div>
		</div>
	</form>
	<Modal bind:isOpen={confirmPasswordModalOpen}>
		<svelte:fragment>
			<ModalTitle>Confirm your password</ModalTitle>
			<ModalDescription class="mt-4 text-sm text-gray-500">
				To unlock updating your password, please enter your current password.
			</ModalDescription>
		</svelte:fragment>
		<svelte:fragment slot="footer">
			<Button
				class="sm:ml-3"
				variant="primary"
				on:click={() => {
					confirmPasswordModalOpen = false;
					canUpdatePassword = true;
				}}
			>
				Unlock
			</Button>
			<Button variant="ghost" on:click={() => (confirmPasswordModalOpen = false)}>Close</Button>
		</svelte:fragment>
	</Modal>
{/if}
