<script lang="ts">
	import { session } from '$app/stores';
	import { graphql, mutation, query } from '$houdini';
	import type { SignOut, Me } from '$houdini';
	import { ButtonOrLink } from '$lib/ui/buttons';
	import AppLayout from '$lib/AppLayout.svelte';

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

<AppLayout>
	{#if $session.loggedIn && $data?.me}
		<h2 class="mb-8 text-2xl text-center font-extrabold text-gray-800">
			Welcome, {$data.me.name}!
		</h2>
		<ButtonOrLink full on:click={logout}>Sign out</ButtonOrLink>
	{:else}
		<h2 class="mb-8 text-2xl text-center font-extrabold text-gray-800">You are not signed in.</h2>
		<div class="w-full flex space-x-4">
			<ButtonOrLink full href="/auth/login">Login</ButtonOrLink>
			<ButtonOrLink full variant="ghost" href="/auth/register">Sign up</ButtonOrLink>
		</div>
	{/if}
</AppLayout>
