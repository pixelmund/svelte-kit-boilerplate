<script lang="ts">
	import { session } from '$app/stores';
	import { graphql, mutation, query } from '$houdini';
	import type { SignOut, Me } from '$houdini';
	import { ButtonOrLink } from '$lib/ui/buttons';
	import Logo from '$lib/Logo.svelte';

	const signOut = mutation<SignOut>(graphql`
		mutation SignOut {
			logout
		}
	`);

	const { data } = query<Me>(graphql`
		query Me {
			me {
				id
				email
				name
			}
		}
	`);

	async function logout() {
		await signOut(null);
		window.location.reload();
	}
</script>

<div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<Logo />
	</div>
	<div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
			{#if $session.loggedIn && $data?.me}
				<h2 class="mb-8 text-2xl text-center font-extrabold text-gray-800">
					Welcome, {$data.me.name}!
				</h2>
				<ButtonOrLink full on:click={logout}>Sign out</ButtonOrLink>
			{:else}
				<h2 class="mb-8 text-2xl text-center font-extrabold text-gray-800">
					You are not signed in.
				</h2>
				<div class="flex space-x-4">
					<ButtonOrLink full href="/auth/login">Login</ButtonOrLink>
					<ButtonOrLink full variant="ghost" href="/auth/register">Sign up</ButtonOrLink>
				</div>
			{/if}
		</div>
	</div>
</div>
