<script lang="ts">
	import MapLibreCareerMap from '$lib/ui/MapLibreCareerMap.svelte';
	import type { ClubHistoryEntry } from '$lib/game/types';

	interface Props {
		history: ClubHistoryEntry[];
		currentId?: string;
	}

	let { history, currentId }: Props = $props();
</script>

<MapLibreCareerMap {history} {currentId} />
