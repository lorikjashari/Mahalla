<script lang="ts">
	import type { GameNotification } from '$lib/game/notifications';
	import { sq } from '$lib/i18n/sq';

	interface Props {
		notifications: GameNotification[];
	}

	let { notifications }: Props = $props();
</script>

{#if notifications.length > 0}
	<section class="detail-section notifications" aria-label={sq.notifications}>
		<p class="detail-kicker">{sq.notifications}</p>
		<ul class="note-list">
			{#each notifications as n (n.id)}
				<li class:urgent={n.urgent}>
					<span class="type">{n.type}</span>
					<div>
						<strong>{n.title}</strong>
						<p>{n.body}</p>
					</div>
				</li>
			{/each}
		</ul>
	</section>
{/if}

<style>
	.note-list {
		list-style: none;
		margin: var(--space-4) 0 0;
		padding: 0;
		display: grid;
		gap: 0;
	}

	.note-list li {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: var(--space-3);
		padding: var(--space-3) 0;
		border-bottom: 1px solid var(--line);
	}

	.note-list li:last-child {
		border-bottom: none;
	}

	.note-list li.urgent strong {
		color: var(--gold);
	}

	.type {
		font-size: var(--text-2xs);
		text-transform: uppercase;
		letter-spacing: 0.1em;
		color: var(--muted);
		padding-top: 0.1rem;
	}

	p {
		margin: 0.2rem 0 0;
		font-size: var(--text-sm);
		color: var(--muted);
		line-height: 1.4;
	}
</style>
