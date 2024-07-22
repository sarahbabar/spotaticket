<script lang="ts">
	import Ticket from '$lib/components/Ticket.svelte';
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

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    const yearRegex = /^.{4}/;
    const monthRegex = /-(0?)([^-]*)-/;

    function getDayName(dateStr: string) {
        const date = new Date(dateStr.concat(" 00:00:00"));
        const dayNumber = date.getDay();
        return days[dayNumber];
    }

    const nthNumber = (num: number) => {
        if (num > 3 && num < 21) return "th";
        switch (num % 10) {
            case 1:
            return "st";
            case 2:
            return "nd";
            case 3:
            return "rd";
            default:
            return "th";
        }
    };

    // date in form 'year-month-day'
    function formatDate(date: string) {
            
        const monthMatch = date.match(monthRegex);
        const month = monthMatch ? parseInt(monthMatch[2]) - 1 : 0; 

        const yearMatch = date.match(yearRegex);
        const year = yearMatch ? yearMatch[0]: "2024";

        const dateTime = new Date(date.concat(" 00:00:00"));
        const dateStr = "" + dateTime.getDate();

        return [getDayName(date), monthNames[month], dateStr.concat(nthNumber(dateTime.getDate())), year];
    }


    function getCountryCode() {
    const language = navigator.language || navigator.language; // 'navigator.userLanguage' is for older IE versions
    const parts = language.split('-');
    const countryCode = parts[1] || 'default_country_code'; // You can set a default if no country code is found

    return countryCode;
    }

    
    onMount( () => {
        console.log(Intl.DateTimeFormat().resolvedOptions().timeZone);
    }) 
     // Logs the country code, e.g., 'US'

     

</script>

<body class="bg-[#27232F] my-4">

    <div class="flex justify-center">
        <h1 class="text-5xl text-center font-mono font-bold text-amber-100 m-6">
            {profile.display_name}'S TOP ARTISTS
        </h1>
        
        <label for="toggleTwo" class="flex items-center cursor-pointer select-none">
            <div class="relative mx-2 ">
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

<!-- <p>{player.item.name}</p> -->

    <div class="flex flex-col items-center">
        {#each showLongTerm ? longTermArtists : mediumTermArtists as artist (artist.key)}
        <a href="{`/tickets/${artist.name}`}">
            <div in:fade|global={ {duration: 500} } class="grid grid-cols-2 text-amber-100 font-mono text-3xl">
                <p class="text-right uppercase">{artist.name}</p>
        
                {#if artist.eventData?.length === 1}
                    <p class="ml-8">{artist.eventData.length} EVENT</p>
                    
                {:else}
                    <p class="ml-8">{artist.eventData?.length} EVENTS</p>
                {/if}
            </div>
        </a>
            
            <!-- <VirtualList itemHeight={264} height="600px" items={artist.eventData} let:item> -->
                <!-- this will be rendered for each currently visible item -->
                <!-- <Ticket
                    artist={artist.name}
                    picture={artist.images[0].url}
                    event={item.name}
                    city={item.city}
                    country={item.country}
                    venue={item.venue}
                    link={item.url}
                    seat={'25'}
                    row={'M'}
                    date={formatDate(item.date)}
                    code={435064}
                /> 
              </VirtualList> -->
        {/each}
    </div>
</body>


