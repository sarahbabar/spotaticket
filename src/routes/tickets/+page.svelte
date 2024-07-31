<script lang="ts">
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

    function formatEvent(amount: number) {
        if (amount === 1) {
            return (` ${amount} Event`).repeat(7);
        }
        return (` ${amount} Events `).repeat(7);
    }

    const _sillly = [
        "rotate-[0deg]", "rotate-[0deg]", 
        "rotate-[1deg]", "-rotate-[1deg]", 
        "rotate-[2deg]", "-rotate-[2deg]", 
        "rotate-[3deg]", "-rotate-[3deg]", 
        "rotate-[4deg]", "-rotate-[4deg]", 
        "rotate-[5deg]", "-rotate-[5deg]", 
        "rotate-[6deg]", "-rotate-[6deg]", 
        "rotate-[7deg]", "-rotate-[7deg]", 
        "rotate-[8deg]", "-rotate-[8deg]", 
        "rotate-[9deg]", "-rotate-[9deg]", 
        "rotate-[10deg]", "-rotate-[10deg]", 
        "rotate-[11deg]", "-rotate-[11deg]", 
        "rotate-[12deg]", "-rotate-[12deg]", 
        "rotate-[13deg]", "-rotate-[13deg]", 
        "rotate-[14deg]", "-rotate-[14deg]", 
        "rotate-[15deg]", "-rotate-[15deg]", 
        "rotate-[16deg]", "-rotate-[16deg]", 
        "rotate-[17deg]", "-rotate-[17deg]", 
        "rotate-[18deg]", "-rotate-[18deg]", 
    ];
    
    function getRandomInt(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRotationClass(index: number) {
        const angle = getRandomInt(5, 18);
        const rotateClass = `rotate-[${angle}deg]`;
        const negativeRotateClass = `-rotate-[${angle}deg]`;

        if (index % 2 === 0) {
            return `${negativeRotateClass}`;
        } else {
            return `${rotateClass}`;
        }
    }
    
</script>

<body in:fade|global={ {duration: 500} } out:fade|global={ {duration: 200} } class="bg-[#27232F] my-4 flex flex-col items-center">

    <div class="flex flex-col justify-center items-center lg:flex-row mb-5 lg:mb-7">
        <h1 class="text-3xl text-center font-mono font-bold text-amber-100 mt-7 mb-2 md:text-5xl lg:flex">
            <p class="uppercase lg:mr-6">{profile.display_name}'S</p>
            <p>TOP ARTISTS</p>
            
        </h1>
        
        <label for="toggleTwo" class="flex items-center cursor-pointer select-none lg:mt-5 lg:ml-4 lg:mr-1">
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
                <a href="{`/tickets/${artist.name}`}" class="star">

                    <div class="">

                    </div>


                    
                    <div in:fade|global={ {duration: 500} } class={`transition-transform duration-500 ease-in-out ${getRotationClass(index)} hover:rotate-0`}>
                        <a href="{`/tickets/${artist.name}`}">
                        <div style="box-shadow:  0px 0px 35px 7px rgba(250, 234, 172, .2);" class="star w-60 h-[310px] bg-[#fffef8] flex flex-col items-center pt-2 mx-10 my-10 sepia-[0.4]">
                            {#if artist.name === "Tame Impala"}
                                <img class="w-56 h-56 object-cover grayscale shadow-sm shadow-zinc-800/50" src="https://thissongissick.com/wp-content/uploads/2019/12/tame-impala-kevin-parker-lowlands-festival-2019-credit-ben-houdijk-shutterstock-1483006730@1400x1050.jpg" alt="" />
                            {:else}
                                <img class="w-56 h-56 object-cover grayscale shadow-sm shadow-zinc-800/50" src={artist.images[0].url} alt="" />
                            {/if}
                
                            <div class="p-3 w-full text-center">
                                <h2 class="mb-1 text-base font-mono font-bold text-zinc-800 uppercase">{artist.name}</h2>
                                <article class="mt-[6px]">

                                    <h2 class="example-left font-mono">{formatEvent(artist.eventData.length)} </h2>
                                    
                                </article>
                            </div>
                        </div>
                        </a>
                    </div>

                </a>
            {/each}
        </div>
    </div>
</body>

<style lang="postcss">
    article {
        max-width: 240px;
        overflow: hidden;
        position: relative;
        min-height: 25px;
    }

    .example-left {
        white-space: nowrap;
        position: absolute;
        top: 0;
        right: 0;
        text-transform: uppercase;
    }

    .example-left {
        -webkit-animation: mymove 8s linear infinite; 
        white-space: nowrap;
        animation: mymove 8s linear infinite alternate;
    }

    @-webkit-keyframes mymove {
        from {
            right: 0;
        }
        to {
            right: -140px;
        }
    }

    @keyframes mymove {
        from {
            right: 0;
        }
        to {
            right: -140px;
        }
    }



    @keyframes early 
    { from { opacity:1; } to { opacity:0; } }

    .early {
        animation:fadeIn ease-in 1; /* call our keyframe named fadeIn, use animation ease-in and repeat it only 1 time */

        animation-fill-mode:forwards;  /* this makes sure that after animation is done we remain at the last keyframe value (opacity: 1)*/

        animation-duration:1s;
        animation-delay: 1.5s
    }

    .star {
        cursor: url("star_cursor_yellow.svg"), auto;
    }

    html, body {
        cursor: url('star_cursor.svg'), auto;
    }
</style>
