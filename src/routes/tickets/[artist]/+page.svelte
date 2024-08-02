<script lang="ts">
	import ClickOutside from '$lib/components/ClickOutside.svelte';
    import HorizontalTicket from '$lib/components/HorizontalTicket.svelte';
	import VerticalTicket from '$lib/components/VerticalTicket.svelte';
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
    
        return [getDayName(date), monthNames[month], dateStr.concat(nthNumber(dateTime.getDate())), year, dateStr];
    }

    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');

    function randomCode(id: string, city: string, day: string) {
        let codeArr = [];

        const idArr = (id.split("")).reverse();
        const cityArr = city.split("");
        const dayArr = (day.split("")).slice(0, 3);

        for (const char of dayArr) {
                codeArr.push(Math.floor(alphabet.indexOf(char.toLocaleLowerCase()) % 10))
        }

        for (let i = 0; i < idArr.length; i++) {
            if (alphabet.includes(idArr[i].toLowerCase())) {
                codeArr.push(Math.floor(alphabet.indexOf(idArr[i].toLocaleLowerCase()) % 10));
            }

            if (i < cityArr.length) {
                codeArr.push(Math.floor(alphabet.indexOf(cityArr[i].toLocaleLowerCase()) % 10))
            }
        }
        const codeStr = (codeArr.slice(0, 6)).join("");
        return codeStr;
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
            hash |= 0; 
        }
        return hash;
    }

    function rowLetter(index: number) {
        return alphabet[(index - 1)];
    }

    const events = artistWithEvents.eventData
    // console.log(events);
    
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

    function horizontalScroll(node: any){
    function handleWheelEvent(e: any) {
      e.preventDefault();
      node.scrollLeft += e.deltaY;
    }

    node.addEventListener('wheel', handleWheelEvent);
    return {
      destroy() {
        node.removeEventListener('wheel', handleWheelEvent)
      }
    };
  }

</script>

<body in:fade|global={ {duration: 500} } class="bg-[#27232F] my-4 flex flex-col items-center">

    {#if events.length > 0}
        <div class="flex flex-col items-center">
            
            <div class="flex flex-col w-full max-w-[950px] my-8">
                <!-- Arrow -->
                <div class="flex justify-between items-center mb-7">
                    <a href="/tickets" class="star">
                        <i class="text-4xl fa-solid fa-arrow-left text-amber-100"></i>
                    </a>
                    
                    <ClickOutside on:clickoutside={() => console.log("meow")}>
                        
                     
                        <div class="relative inline-block text-left mb-2">
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
                                            <div class="flex items-center -mb-1 p-2 rounded">
                                                <input id="checkbox-item-all" type="checkbox" value="" class="w-4 h-4 text-amber-100 rounded accent-[#27232F]" bind:checked={selectAll} on:click={toggleAll}>
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

                </ClickOutside>
                    
                </div>
                
                <div class="">
                    <div class="hidden lg:block">
                        {#if filteredEvents.length === 0}
                            <div class="w-[840px] mx-10">

                            </div>
                            
                        {:else}
                            <VirtualList  height="870px" items={filteredEvents} let:item> 
                                <HorizontalTicket
                                    artist={artistWithEvents.name}
                                    picture={artistWithEvents.images[0].url}
                                    event={item.name}
                                    city={item.city}
                                    country={item.country}
                                    venue={item.venue}
                                    link={item.url}
                                    seat={randomIntFromID((item.event_id).concat(item.artist_id))}
                                    row={rowLetter(randomIntFromID((item.event_id).concat(item.artist_id)))}
                                    date={formatDate(item.date)}
                                    code={randomCode(item.event_id, item.city, formatDate(item.date)[0])}
                                />            
                            </VirtualList> 
                        {/if}

                    
                    </div>

                    <div class="block lg:hidden">
                        <!-- <VirtualList height="700px" items={filteredEvents} let:item>  
                            <VerticalTicket
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
                                    code={randomCode(item.event_id, item.city, formatDate(item.date)[0])}
                                />   
                        </VirtualList>  -->

                        <div use:horizontalScroll class="flex w-80 overflow-x-auto scrollbar scrollbar-thin">  
                            {#each filteredEvents as item}
                                <VerticalTicket
                                    artist={artistWithEvents.name}
                                    picture={artistWithEvents.images[0].url}
                                    event={item.name}
                                    city={item.city}
                                    country={item.country}
                                    venue={item.venue}
                                    link={item.url}
                                    seat={randomIntFromID((item.event_id).concat(item.artist_id))}
                                    row={rowLetter(randomIntFromID((item.event_id).concat(item.artist_id)))}
                                    date={formatDate(item.date)}
                                    code={randomCode(item.event_id, item.city, formatDate(item.date)[0])}
                                />   
                            {/each} 
                        </div> 
                    </div>
                </div> 
            </div>
        </div>

    {:else}
        <div class="text-3xl text-amber-100 font-mono">
            <p>Could not find events for this artist ;-; </p>
        </div>
    {/if}
</body>

<style lang="postcss">

</style>