<script lang="ts">
    import Ticket from '$lib/components/Ticket.svelte';
    //@ts-ignore
    import VirtualList from '@sveltejs/svelte-virtual-list';
	import { fade } from 'svelte/transition';

    export let data;
    const { artistWithEvents } = data;

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

    function randomIntFromID(id: string) {

    // gen hash code from the string
    let hash = hashCode(id);
    
    const min = 1;
    const max = 26;
    
    let boundedRand = Math.abs(hash % (max - min + 1)) + min;
    return boundedRand;
    }

    function hashCode(str: string) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    function rowLetter(index: number) {
        return alphabet[(index - 1)];
    }

    let events = artistWithEvents[0].eventData
    console.log(events);
    
    let showDrop = false;
    function toggleDropDown() {
        showDrop = !showDrop;
    }

    let selectAll = true;
    let cities: {[key: string]: boolean} = {};

    for (const event of events) {
        cities[event.city] = selectAll;
    }

    function toggleAll() {
        selectAll = !selectAll;
        for (const city in cities) {
            cities[city] = selectAll;
        }
    }

    function toggleCity(city: string) {
        cities[city] = !cities[city];
    }

    $: filteredEvents = selectAll ? events: events.filter((event: any) => cities[event.city]);

</script>

<body in:fade|global={ {duration: 500} } class="bg-[#27232F] my-4">
    <div class="flex flex-col items-center">
        
        <div class="flex flex-col w-full max-w-[950px] my-8">
            <!-- Arrow -->
            <div class="flex justify-between items-center mb-7">
                <a href="/tickets">
                    <i class="text-4xl fa-solid fa-arrow-left text-amber-100"></i>
                </a>


                <div class="relative inline-block text-left">
                    <button id="dropdownBgHoverButton" data-dropdown-toggle="dropdownBgHover" class="text-[#27232F] bg-amber-100 font-mono rounded-full text-base font-bold px-5 py-2.5 text-center inline-flex items-center" type="button" on:click={toggleDropDown}>
                        <i class="fa-solid fa-earth-americas text-[#27232F] mr-2"></i>
                        Location 
                        <i class="fa-solid fa-caret-down text-[#27232F] ml-2"></i>
                    </button>
                        
                    {#if showDrop}
                        <!-- Dropdown menu -->
                        <div in:fade|global={ {duration: 200} } out:fade|global={ {duration: 200} } id="dropdownBgHover" class="absolute right-0 mt-2 z-10 w-48 bg-[#4b4359] rounded-2xl shadow">
                            <ul class="p-3 space-y-1 text-sm text-amber-100" aria-labelledby="dropdownBgHoverButton">

                                <li>
                                    <div class="flex items-center p-2 rounded">
                                        <input checked id="checkbox-item-all" type="checkbox" value="" class="w-4 h-4 text-amber-100 rounded accent-[#27232F]" on:click={toggleAll}>
                                        <label for="checkbox-item-all" class="w-full ms-2 text-sm font-mono text-amber-100 rounded ">Select All</label>
                                    </div>
                                </li>

                                <div class="h-[110px] overflow-y-auto">
                                    {#each Object.keys(cities) as city, index}
                                        <li>
                                            <div class="flex items-center p-2 rounded">
                                                <input id={`checkbox-item-${index}`} disabled={selectAll} on:click={() => toggleCity(city)} bind:checked={cities[city]} type="checkbox" value={city} class="w-4 h-4 text-amber-100 rounded accent-[#27232F]">
                                                <label for={`checkbox-item-${index}`} class="w-full ms-2 text-sm font-mono text-amber-100 rounded ">{city}</label>
                                            </div>
                                        </li>
                                    {/each}
                                </div> 

                            </ul>
                        </div>
                    {/if}

                </div>
                
            </div>
            
            <div class="mt-4">
                <VirtualList itemHeight={264} height="870px" items={filteredEvents} let:item > 
                        <Ticket
                            artist={artistWithEvents[0].name}
                            picture={artistWithEvents[0].images[0].url}
                            event={item.name}
                            city={item.city}
                            country={item.country}
                            venue={item.venue}
                            link={item.url}
                            seat={randomIntFromID((item.event_id).concat(item.artist_id))}
                            row={rowLetter(randomIntFromID((item.event_id).concat(item.artist_id)))}
                            date={formatDate(item.date)}
                            code={435064}
                        />            
                </VirtualList>
            </div>
        </div>
    </div>
</body>

<style lang="postcss">

</style>