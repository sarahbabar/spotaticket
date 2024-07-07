<script lang="ts">
    
    import QR from '@svelte-put/qr/svg/QR.svelte';
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
</style>


<body class="bg-slate-500 my-4">
    <h1 class="text-3xl text-center font-mono font-bold text-white my-4">
        {profile.display_name}'S TOP ARTISTS

    </h1>


    

<!-- <p>{player.item.name}</p> -->

    <ul class="flex flex-col items-center">
        {#each artists as artist}

        <div class="mx-4 my-4 flex flex-row shadow-lg items-center max-w-[840px] transition duration-200 hover:scale-105">
            <div class="w-60 h-60 relative">
                <img src={artist.images[0].url} alt="artist img" class="object-cover w-full h-full">
                <ul class="flex space-x-3 text-sm font-mono font-bold px-1 pt-2 -rotate-90 origin-top-left justify-center">
                   <li class="text-white/50">ADMIT ONE</li> 
                   <li class="text-white">ADMIT ONE</li> 
                   <li class="text-white/50">ADMIT ONE</li> 
                </ul>
                <p class="absolute bottom-0 right-0 text-white/50 text-sm font-mono font-bold px-3 py-2">#435064</p>
            </div>
            
            <div class="flex bg-white h-60 w-[600px]">
                
                <div class="w-[430px] text-lg">
                    <div class="grid grid-cols-3 font-mono text-zinc-800 text-center my-3 mx-4 py-1 border-y-[1px] border-zinc-800">
                        <p>TUESDAY</p>
                        <p>OCTOBER 29TH</p>
                        <p>2024</p>
                    </div>
                    
                    <p class="mt-4 text-3xl text-zinc-800 uppercase font-mono font-semibold m-2 text-center">{artist.name}</p>
                    <p class="mt-4 text-xl uppercase text-center font-dosis font-normal">After Hours til Dawn Tour</p>
                    <p class="mt-4 text-lg uppercase text-center font-mono underline underline-offset-8 decoration-zinc-800 decoration-[0.5px]">@Scotiabank Arena</p>
                    <p class="text-lg uppercase text-center font-mono">Toronto, CA</p>

                </div>

                <div class="relative w-[170px] h-60 border-zinc-800/50 border-dashed border-l-2">
                    <div class="relative w-[172px] h-60 border-slate-500 border-dotted border-r-[9px]">
                    <ul class="absolute -bottom-7 left-0 w-60 -rotate-90 origin-top-left flex space-x-3 text-sm font-mono font-bold px-1 pt-2">
                        <li class="text-zinc-800/50">ADMIT ONE</li> 
                        <li class="text-zinc-800">ADMIT ONE</li> 
                        <li class="text-zinc-800/50">ADMIT ONE</li> 
                     </ul>

                     <div class="absolute inset-0 flex justify-center items-center -rotate-90">
                        
                        <div class="flex space-x-6 font-dosis items-center">

                            <div class="text-center">
                                <p class="text-lg">ROW</p>
                                <p class="text-3xl">M</p>
                            </div>

                            <QR
                                class=""
                                data="https://www.ticketmaster.com.au/pinkpantheress-west-melbourne-29-10-2024/event/13005F84CA8070E7"
                                moduleFill="black"
                                anchorOuterFill="black"
                                anchorInnerFill="black"
                                width="75"
                                height="75"
                            />
                            <div class="text-center">
                                <p class="text-lg">SEAT</p>
                                <p class="text-3xl">25</p>
                            </div>
                        </div>
                

                     </div>
                        
                        <p class="pt-2.5 font-mono font-bold text-zinc-800/50 absolute top-1/2 transform -translate-y-4 right-0 -rotate-90">#435064</p>
                    </div>
                </div>
                
            </div>
        </div>
            
        {/each}

    </ul>
</body>


