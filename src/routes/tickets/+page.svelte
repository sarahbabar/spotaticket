<script lang="ts">
	import Ticket from '$lib/components/Ticket.svelte';
    
    export let data;
    const { artists } = data;
    const { profile } = data;
    const { player } = data;

</script>

<style>
    .custom-borders {
        border-left-width: 2px;
        border-left-style: dashed;
        border-right-width: 10px;
        border-right-style: dotted;
        border-right-color: slategray;
    }
    .box {
        --mask: radial-gradient(4px at right,#ffffff00 97%,#ffffff) 50%/ 100% 13px;
        -webkit-mask: var(--mask);
                mask: var(--mask);
}
</style>


<body class="bg-slate-600 my-4">
    <h1 class="text-3xl text-center font-mono font-bold text-white my-4">
        {profile.display_name}'S TOP ARTISTS
    </h1>

<!-- <p>{player.item.name}</p> -->

    <ul class="flex flex-col items-center">
        {#each artists as artist}
            <Ticket
                name={artist.name}
                picture={artist.images[0].url}
            />
        {/each}
    </ul>
</body>


