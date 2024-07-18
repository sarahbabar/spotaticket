<script lang="ts">
	import Ticket from '$lib/components/Ticket.svelte';
    
    export let data;
    const { artists, profile, player } = data;

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


<body class="bg-[#27232F] my-4">

    <div class="flex justify-center">
        <h1 class="text-5xl text-center font-mono font-bold text-amber-100 m-6">
            {profile.display_name}'S TOP ARTISTS
        </h1>
        
        <label for="toggleTwo" class="flex items-center cursor-pointer select-none">
            <div class="relative mx-2 ">
                <input type="checkbox" id="toggleTwo" class="peer sr-only"/>
                <div class="block h-12 rounded-full bg-[#4b4359] w-24 transition duration-500 ease-in-out  peer-checked:bg-amber-100"></div>
        
                <div class="font-mono text-xl font-bold absolute w-10 h-10  transition ease-in-out duration-500 bg-amber-100 rounded-full dot left-[5px] top-1 
                            peer-checked:translate-x-12 peer-checked:bg-[#4b4359] flex items-center justify-center text-[#4b4359] peer-checked:text-amber-100
        
                  before:content-['Y'] peer-checked:before:content-['6M']
                ">
                </div>
            </div>
        </label>

    </div>



<!-- <p>{player.item.name}</p> -->

    <ul class="flex flex-col items-center">
        {#each artists as artist}

            <div class="">
                <!-- <img src="{artist.images[0].url}" alt="artist img"> -->
                 <p class="text-amber-100 font-mono text-2xl">{artist.name}</p>
            </div>

                <!-- <Ticket
                    artist={artist.name}
                    picture={artist.images[0].url}
                    event={'After Hours Til Dawn Tour'}
                    city={'Toronto'}
                    country={'CA'}
                    venue={'scotiabank arena'}
                    link={"https://www.ticketmaster.com.au/pinkpantheress-west-melbourne-29-10-2024/event/13005F84CA8070E7"}
                    seat={'25'}
                    row={'M'}
                    date={['Tuesday', 'October', '29th', '2024']}
                    code={435064}
                /> -->

            {#each artist.eventData as event}
                <!-- <Ticket
                    artist={artist.name}
                    picture={artist.images[0].url}
                    event={event.name}
                    city={event.city}
                    country={event.country}
                    venue={event.venue}
                    link={event.url}
                    seat={'25'}
                    row={'M'}
                    date={formatDate(event.date)}
                    code={435064}
                />  -->
                
                

                <!-- <div class="m-4 p-4">
                    <h2 class="text-white">{artist.name}</h2>
                    <h2 class="text-white">{event.id}</h2>
                    <h2 class="text-white">{event.name}</h2>

                </div> -->
                
            {/each}
            
        {/each}
    </ul>
</body>


