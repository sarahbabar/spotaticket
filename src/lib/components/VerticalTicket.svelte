<script lang="ts">
    import QR from '@svelte-put/qr/svg/QR.svelte';
    import { fade } from 'svelte/transition';
    export let artist: string;
    export let picture: any;
    export let event: string;
    export let city: string;
    export let country: string;
    export let venue: string;
    export let link: string;
    export let seat: number;
    export let row: string;
    export let date: string[];
    export let code: string;

</script>

<a href="{link}" target="_blank" class="star">
    <div in:fade|global={ {duration: 500} } out:fade|global={ {duration: 300} } class="flex flex-col items-center mb-6 mt-2 mx-10 md:mt-10 md:mb-10 grayscale sepia-[0.4]">

        <div class="flex flex-col items-center w-60 h-[450px] bg-[#fffef8] relative">
            
            <div class="">
                <img src={ picture } alt="artist img" class="slanted-edge object-cover">
            </div>

            <div class="flex flex-col items-center w-16 h-20 text-[#fffef8] font-dosis rounded-sm bg-zinc-900 sepia-0 absolute right-2 top-40">
                <p class="uppercase -mb-1 mt-0.5">{ date[1].slice(0, 3) }</p>
                <p class="text-3xl">{ date[4] }</p>
                <p class="mb-0.5 -mt-1">{ date[3] }</p>
            </div>

            <div class="absolute left-1 top-[233px] mt-3 mb-1 mx-2 rotate-90 origin-left">
                <p class="text-center font-mono tracking-[0.2em] text-sm uppercase">general admission</p>
            </div>

            <div class="w-52 mr-1 ml-6 p-1 flex flex-col my-3">
                <p class="uppercase text-right font-dosis font-bold text-xl mt-1">{ artist }</p>
                <p class="uppercase text-right font-dosis font-semibold text-base my-1">{ event }</p>
                <p class="uppercase text-right font-mono text-sm mb-1 mt-2">@{ venue }</p>
                <p class="uppercase text-right font-mono text-sm ">{ city }, { country }</p>
            </div>
            
        </div>

        <div class="flex flex-col w-60 h-52 box bg-[#fffef8] items-center border-zinc-800/50 border-dashed border-t-2">
            
            <ul class="flex space-x-3 text-sm font-mono font-bold mb-1 mt-3">
                <li class="text-zinc-800/50">ADMIT ONE</li> 
                <li class="text-zinc-800">ADMIT ONE</li> 
                <li class="text-zinc-800/50">ADMIT ONE</li> 
            </ul>

            <div class="flex w-full justify-evenly mt-2 mb-1 font-dosis">
                <div class="text-center">
                    <p class="text-lg">ROW</p>
                    <p class="text-3xl uppercase">{ row }</p>
                </div>

                <div>
                    <img alt="qrcode" src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data={ link }" width="75" height="75">
                </div>

                <div class="text-center">
                    <p class="text-lg">SEAT</p>
                    <p class="text-3xl">{ seat }</p>
                </div>
            </div>

            <p class="font-mono font-bold text-zinc-800/50 mb-1">{ code }</p>
            <p class="font-libre text-6xl ">S{ code }</p>
                
        
        </div>
        
    </div>

</a>

<style lang="postcss">
    .box {
        --mask: radial-gradient(4px at bottom,#0000 97%,#000) 50% / 13px 100%;
        -webkit-mask: var(--mask);
        mask: var(--mask);
    }

    .box2 {
        --mask: radial-gradient(10px at 10px 100%,#0000 100%,#27232F) -10px;
        -webkit-mask: var(--mask);
        mask: var(--mask);
    }

    .topp {
        clip-path: polygon(0 0,100% 0,100% 100%,0 calc(100% - 425px));
    }
    

    .slanted-edge {
        --p: 55px; /* control the shape (can be percentage) */
        height: 240px;
        aspect-ratio: 1;
        clip-path: polygon(0 0,101% 0,101% calc(100% - var(--p)),0 100%);
    }


</style>