<script lang="ts">
	import { Menu, MenuButton, MenuItems, Transition } from '@rgossiaux/svelte-headlessui';
</script>

<Menu class="relative" let:open>
	<MenuButton as="button">
		<slot name="button" />
	</MenuButton>
	<MenuItems>
		<Transition
			show={open}
			enter="transition ease-out duration-100"
			enterFrom="transform opacity-0 scale-95"
			enterTo="transform opacity-100 scale-100"
			leave="transition ease-in duration-75"
			leaveFrom="transform opacity-100 scale-100"
			leaveTo="transform opacity-0 scale-95"
		>
			<div
				class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
				role="menu"
				aria-orientation="vertical"
			>
				<slot name="items" />
			</div>
		</Transition>
	</MenuItems>
</Menu>
