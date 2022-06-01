<script lang="ts">
	import Input from './TextInput.svelte';
	import Label from './Label.svelte';
	import { ValidationMessage } from '@felte/reporter-svelte';
	import ErrorMessage from './ErrorMessage.svelte';
	import { Icon } from '@steeze-ui/svelte-icon';
	import { ExclamationCircle } from '@steeze-ui/heroicons';

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
	export let containerClass: string = '';
	export let disabled: boolean = false;

	$: if (!id) {
		id = name;
	}

	let hasError: boolean = false;
	let klass: string = '';

	export { klass as class };
</script>

<div class={containerClass}>
	<Label {id}>
		{label}
	</Label>
	<div class="mt-1 relative rounded-md shadow-sm">
		<Input
			{...$$restProps}
			{id}
			{name}
			{disabled}
			{type}
			{value}
			class="{hasError ? '!border-red-500' : ''} {klass}"
		/>
		<div
			class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none transition-opacity {hasError
				? 'opacity-100'
				: 'opacity-0'}"
		>
			<Icon src={ExclamationCircle} theme="solid" class="text-red-500 h-5 w-5" />
		</div>
	</div>
	<ValidationMessage for={name} let:messages>
		<ErrorMessage {messages} {name} bind:hasError />
		<span slot="placeholder" />
	</ValidationMessage>
</div>
