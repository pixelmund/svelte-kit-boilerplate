<script lang="ts">
	import Input from './TextInput.svelte';
	import Label from './Label.svelte';
	import { ValidationMessage } from '@felte/reporter-svelte';
	import ErrorMessage from './ErrorMessage.svelte';

	export let type:
		| 'text'
		| 'password'
		| 'email'
		| 'number'
		| 'tel'
		| 'url'
		| 'search'
		| 'date'
		| 'time'
		| 'datetime-local'
		| 'month'
		| 'week'
		| 'color'
		| 'hidden' = 'text';

	export let name: string;
	export let id: string = '';
	export let value: string = '';
	export let label: string = '';

	$: if (!id) {
		id = name;
	}

	let hasError: boolean = false;
	let klass: string = '';

	export { klass as class };
</script>

<div>
	<Label {id}>
		{label}
	</Label>
	<div class="mt-1 relative rounded-md shadow-sm">
		<Input {id} {name} {type} {value} class={klass} />
		<div
			class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-opacity {hasError
				? 'opacity-100'
				: 'opacity-0'}"
		>
			<svg
				class="h-5 w-5 text-red-500"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				aria-hidden="true"
			>
				<path
					fill-rule="evenodd"
					d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
					clip-rule="evenodd"
				/>
			</svg>
		</div>
	</div>
	<ValidationMessage for={name} let:messages>
		<ErrorMessage {messages} {name} bind:hasError />
		<span slot="placeholder" />
	</ValidationMessage>
</div>
