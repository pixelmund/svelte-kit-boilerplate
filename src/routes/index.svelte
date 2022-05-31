<script lang="ts">
	import { session } from '$app/stores';
	import { graphql, mutation, query } from '$houdini';
	import type { SignOut, Me } from '$houdini';
	import { ButtonOrLink } from '$lib/ui/buttons';

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

{#if $session.loggedIn && $data?.me}
	<h2 class="mb-8 text-2xl text-center font-extrabold text-gray-800">
		Welcome, {$data.me.name}!
	</h2>
	<div class="space-y-2 w-full">
		<ButtonOrLink full href="/notes">My notes</ButtonOrLink>
		<ButtonOrLink variant="secondary" full href="/profile">Profile</ButtonOrLink>
		<ButtonOrLink variant="ghost" full on:click={logout}>Sign out</ButtonOrLink>
	</div>
{:else}
	<h2 class="mb-8 text-2xl text-center font-extrabold text-gray-800">You are not signed in.</h2>
	<div class="w-full flex space-x-4">
		<ButtonOrLink full href="/auth/login">Login</ButtonOrLink>
		<ButtonOrLink full variant="ghost" href="/auth/register">Sign up</ButtonOrLink>
	</div>
{/if}
