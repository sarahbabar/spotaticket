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

    function shortenString(inputStr: string) {
        if (inputStr.length <= 37) {
            return inputStr;
        }
        let words = inputStr.split(' ');
        while (words.join(' ').length > 37) {
            words.pop();
        }

        let shortenedStr = words.join(' ');

        let lastTwoWords = shortenedStr.split(' ').slice(-2).join(' ');
        if (lastTwoWords.toLocaleLowerCase() === "presented by" || lastTwoWords.toLocaleLowerCase() === "at the") {
            words = words.slice(0, -2);
        }

        return words.join(' ');
    }

</script>

<a href="{link}" target="_blank" class="star">
    <div in:fade|global={ {duration: 500} } class="group mx-10 my-6 flex flex-row shadow-lg items-center max-w-[840px] sepia-[0.4] transition duration-200 hover:scale-[1.02] hover:sepia-0">
        <div class="w-60 h-60 relative">
            <img src={ picture } alt="artist img" class="object-cover w-full h-full grayscale group-hover:grayscale-0">
            <ul class="flex space-x-3 text-xs font-mono font-bold px-1 pt-2 -rotate-90 origin-top-left justify-center whitespace-nowrap">
               <li class="text-white/20">ADMIT ONE</li> 
               <li class="text-white/50">ADMIT ONE</li> 
               <li class="text-white/20">ADMIT ONE</li> 
            </ul>
            <p class="absolute bottom-0 right-0 text-white/50 text-sm font-mono font-bold px-3 py-2">#{ code }</p>
        </div>
        
        <div class="flex bg-[#fffef8] h-60 w-[600px]">
            
            <div class="w-[430px] text-lg">
                <div class="custom-grid font-mono uppercase text-zinc-800 text-center my-3 mx-4 py-1 border-y-[1px] border-zinc-800">
                    <p>{ date[0] }</p>
                    <p>{ date[1] } { date[2] }</p>
                    <p>{ date[3] }</p>
                </div>
                
                <p class="mt-5 text-3xl text-zinc-800 uppercase font-mono font-semibold m-2 text-center">{ artist }</p>
                <p class="mt-3 text-lg uppercase text-center font-dosis font-normal mx-2">{ shortenString(event) }</p>
                <p class="mt-3 text-lg uppercase text-center font-mono underline underline-offset-8 decoration-zinc-800 decoration-[0.5px] mx-4 line">@{ shortenString(venue) }</p>
                <p class="text-lg uppercase text-center font-mono mb-2">{ city }, { country }</p>
    
            </div>
    
            <div class="relative w-[170px] h-60 border-zinc-800/50 border-dashed border-l-2">
                
                <div class="relative w-[172px] h-60 bg-[#fffef8] box">
                    <div class="absolute top-0 inset-0 w-full left-[42px] -rotate-90">
                        <ul class="w-full flex space-x-3 text-xs font-mono font-bold whitespace-nowrap justify-center">
                            <li class="text-zinc-800/50">ADMIT ONE</li> 
                            <li class="text-zinc-800">ADMIT ONE</li> 
                            <li class="text-zinc-800/50">ADMIT ONE</li> 
                        </ul>
    
                        <div class="flex space-x-6 font-dosis items-center justify-center mt-[20px]">
    
                            <div class="text-center">
                                <p class="text-lg">ROW</p>
                                <p class="text-3xl uppercase">{ row }</p>
                            </div>
    
                            <img alt="qrcode" src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data={link}" width="75" height="75">
    
                            <div class="text-center">
                                <p class="text-lg">SEAT</p>
                                <p class="text-3xl">{ seat }</p>
                            </div>
                        </div>
                    </div>  
                    <p class="pt-2.5 font-mono font-bold text-zinc-800/50 absolute top-1/2 transform -translate-y-4 right-0 -rotate-90">#{ code }</p>
                </div>
            </div>
            
        </div>
    </div>
</a>
    
<style lang="postcss">
    .box {
        --mask: radial-gradient(4px at right,#ffffff00 97%,#ffffff) 50%/ 100% 13px;
        -webkit-mask: var(--mask);
                mask: var(--mask);
    }

    .custom-grid {
        display: grid;
        grid-template-columns: 1fr auto 1fr; /* The middle column set to auto will grow as needed */
        align-items: center; /* Align the items vertically at the center of their cells */
    }
    
</style>
