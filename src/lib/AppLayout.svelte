<script lang="ts">
	import Logo from './Logo.svelte';
</script>

<div class="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
	<div class="sm:mx-auto sm:w-full sm:max-w-md">
		<a href="/">
			<Logo />
		</a>
	</div>
	<div class="mt-8 px-2 sm:px-0 sm:mx-auto sm:w-full sm:max-w-md">
		<div class="bg-white py-8 px-4 app-container shadow rounded-lg sm:px-10">
			<slot />
		</div>
	</div>
</div>
