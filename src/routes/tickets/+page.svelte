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
                artist={artist.name}
                picture={artist.images[0].url}
                event={'After Hours Til Dawn Tour'}
                city={'Toronto'}
                country={'CA'}
                venue={'scotiabank arena'}
                link={"https://www.ticketmaster.com.au/pinkpantheress-west-melbourne-29-10-2024/event/13005F84CA8070E7"}
                seat={'25'}
                row={'M'}
                date={['Tuesday', 'October 29th', '2024']}
                code={435064}
            />
        {/each}
    </ul>
</body>


