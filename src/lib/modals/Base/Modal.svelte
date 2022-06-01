<script>
	import { Dialog, DialogOverlay, Transition, TransitionChild } from '@rgossiaux/svelte-headlessui';

	export let isOpen = false;

	function closeModal() {
		isOpen = false;
	}
</script>

<Transition appear show={isOpen}>
	<Dialog as="div" class="fixed inset-0 z-10 overflow-y-auto" on:close={closeModal}>
		<TransitionChild
			enter="ease-out duration-300"
			enterFrom="opacity-0"
			enterTo="opacity-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100"
			leaveTo="opacity-0"
		>
			<DialogOverlay class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
		</TransitionChild>

		<TransitionChild
			class="flex items-end sm:items-center justify-center min-h-screen p-4 text-center sm:p-0"
			enter="ease-out duration-300"
			enterFrom="opacity-0 scale-95"
			enterTo="opacity-100 scale-100"
			leave="ease-in duration-200"
			leaveFrom="opacity-100 scale-100"
			leaveTo="opacity-0 scale-95"
		>
			<div
				class="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full"
			>
				<div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="mt-3 text-center sm:mt-0 sm:text-left">
						<slot />
					</div>
				</div>
				<div class="bg-gray-50 mt-3 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
					<slot name="footer" />
				</div>
			</div>
		</TransitionChild>
	</Dialog>
</Transition>
