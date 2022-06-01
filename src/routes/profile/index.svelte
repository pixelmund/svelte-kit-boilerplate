<script lang="ts">
	import { graphql, mutation, query, type ProfileQuery, type UpdateProfile } from '$houdini';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { LockClosed, LockOpen } from '@steeze-ui/heroicons';
	import { object, string } from 'zod';
	import { createForm, Field, Form } from '$lib/forms';
	import { SubmitButton, Button } from '$lib/ui/buttons';
	import { ConfirmPasswordModal } from '$lib/modals';

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

	const { form, isSubmitting } = createForm({
		schema: object({
			name: string().min(1),
			email: string().email().min(1),
			password: string()
				.optional()
				.refine(
					(pw) => {
						if (canUpdatePassword && pw && pw.length < 6) {
							return false;
						}
						return true;
					},
					{ message: 'Password must be at least 6 characters' }
				)
		}),
		initialValues: {
			name: $data?.me?.name ?? undefined,
			email: $data?.me?.email ?? undefined
		},
		onSubmit: async ({ name, password }) => {
			await updateProfile({ input: { name, canUpdatePassword, password } });
		}
	});

	const onConfirmPassword = (verified: boolean) => {
		if (!verified) return;
		canUpdatePassword = true;
		confirmPasswordModalOpen = false;
	};
</script>

{#if $data && $data.me}
	<h2 class="mb-2 text-3xl text-center font-extrabold text-gray-800">Profile</h2>
	<Form {form} {isSubmitting} class="w-full space-y-8 divide-y divide-gray-200">
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
								on:click={() => {
									if (canUpdatePassword) {
										canUpdatePassword = false;
									} else {
										confirmPasswordModalOpen = true;
									}
								}}
								variant="ghost"
								size="small"
								class="ml-auto pointer-events-auto !py-1.5 !px-2 !bg-white"
							>
								{#if canUpdatePassword}
									<Icon src={LockOpen} class="w-4 h-4" />
								{:else}
									<Icon src={LockClosed} class="w-4 h-4" />
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
				<SubmitButton isSubmitting={$isSubmitting}>Save</SubmitButton>
			</div>
		</div>
	</Form>
	<ConfirmPasswordModal bind:isOpen={confirmPasswordModalOpen} onVerified={onConfirmPassword} />
{/if}
