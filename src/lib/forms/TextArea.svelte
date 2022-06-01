<script lang="ts">
	export let name: string;
	export let id: string = '';
	export let disabled: boolean = false;
	export let placeholder: string = '';

	export let cols: number = 30;
	export let rows: number = 4;

	let klass: string = '';

	export { klass as class };
</script>

<textarea
	class="appearance-none block w-full px-3 py-2 border border-gray-300 disabled:bg-gray-100 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm {klass}"
	{name}
	{id}
	{disabled}
	{placeholder}
	{...$$restProps}
	{cols}
	{rows}
/>
