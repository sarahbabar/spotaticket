<script lang="ts">
	import Card from '$lib/components/Card.svelte';
    import HorizontalTicket from '$lib/components/HorizontalTicket.svelte';
    import VericalTicket from '$lib/components/VerticalTicket.svelte';
    //@ts-ignore
	import VirtualList from '@sveltejs/svelte-virtual-list';
	import { onMount } from 'svelte';
	import { fade, slide, blur, fly, scale, draw, crossfade } from 'svelte/transition';
    
    export let data;
    const { longTermArtists, mediumTermArtists, profile, player } = data;
    
    let showLongTerm = true;

    function toggleArtists() {
        showLongTerm = !showLongTerm;
    }
    
</script>

<main class="bg-[#27232F] my-4 flex flex-col items-center">

    <div class="flex flex-col justify-center items-center lg:flex-row mb-5 lg:mb-7">
        <h1 class="text-3xl text-center font-mono font-bold text-amber-100 mt-7 mb-2 md:text-5xl lg:flex">
            <p class="uppercase lg:mr-6">{profile.display_name}'S</p>
            <p>TOP ARTISTS</p>
            
        </h1>
        
        <label for="toggleTwo" class="flex items-center star select-none lg:mt-5 lg:ml-4 lg:mr-1">
            <div class="relative mx-2">
                <input type="checkbox" id="toggleTwo" class="peer sr-only" on:change={toggleArtists}/>
                <div class="block h-12 rounded-full bg-[#4b4359] w-24 transition duration-300 ease-in-out peer-checked:bg-amber-100"></div>
        
                <div class="font-mono text-xl font-bold absolute w-10 h-10 transition ease-in-out duration-500 bg-amber-100 rounded-full dot left-[5px] top-1 
                            peer-checked:translate-x-12 peer-checked:bg-[#4b4359] flex items-center justify-center text-[#4b4359] peer-checked:text-amber-100
        
                  before:content-['1Y'] peer-checked:before:content-['6M']
                ">
                </div>
            </div>
        </label>

    </div>

    <div class="flex justify-center items-center min-h-screen">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-6xl w-full m-5">
            {#each showLongTerm ? longTermArtists : mediumTermArtists as artist, index (artist.key)}
                {@const cursor = artist.name === "Charli xcx" ? "apple" : "star"}
                {#if artist.eventData.length > 0}
                    <a href="{`/tickets/${artist.name}`}" class="{cursor}">
                        <Card
                            artist = {artist.name}
                            eventDataLen = {artist.eventData.length}
                            picture = {artist.images[0].url}
                            index = {index}
                        ></Card>
                    </a>
                {:else}
                    <div class="{cursor}">
                        <Card
                            artist = {artist.name}
                            eventDataLen = {artist.eventData.length}
                            picture = {artist.images[0].url}
                            index = {index}
                        ></Card>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</main>

<style lang="postcss">

    

</style>
