<script lang="ts">
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
	export let disabled: boolean = false;

	let klass: string = '';

	export { klass as class };
</script>

<input
	class="appearance-none block w-full px-3 py-2 border border-gray-300 disabled:bg-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm {klass}"
	{type}
	{name}
	{id}
	{value}
	{disabled}
	{...$$restProps}
/>
