<script lang="ts">
	import { onDestroy, createEventDispatcher } from 'svelte';

	export let threshold = 0;
	export let horizontal = false;
	export let elementScroll: HTMLElement | undefined = undefined;
	export let hasMore = true;

	const dispatch = createEventDispatcher();
	let isLoadMore = false;
	let component: HTMLDivElement;

	$: {
		if (component || elementScroll) {
			const element = elementScroll ? elementScroll : component.parentNode!;

			element.addEventListener('scroll', onScroll);
			element.addEventListener('resize', onScroll);
		}
	}

	const onScroll = (e: Event) => {
		const target = e.target! as any;

		const offset = horizontal
			? target.scrollWidth - target.clientWidth - target.scrollLeft
			: target.scrollHeight - target.clientHeight - target.scrollTop;

		if (offset <= threshold) {
			if (!isLoadMore && hasMore) {
				dispatch('loadMore');
			}
			isLoadMore = true;
		} else {
			isLoadMore = false;
		}
	};

	onDestroy(() => {
		if (component || elementScroll) {
			const element = elementScroll ? elementScroll : component.parentNode!;

			element.removeEventListener('scroll', null);
			element.removeEventListener('resize', null);
		}
	});
</script>

<div bind:this={component} style="width:0px" />
