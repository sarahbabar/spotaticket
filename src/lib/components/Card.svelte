<script lang="ts">
	import { fade, slide, blur, fly, scale, draw, crossfade } from 'svelte/transition';

    export let artist: string;
    export let picture: any;
    export let index: number;

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

<div in:fly|global={ {duration: 500, y:getRandomInt(-100, 100), x:getRandomInt(-100, 100)} } class={`transition-transform duration-500 ease-in-out ${getRotationClass(index)} hover:rotate-0`}>
    
    <div style="box-shadow:  0px 0px 35px 7px rgba(250, 234, 172, .2);" class="w-60 h-[320px] bg-[#fffef8] flex flex-col items-center pt-2 mx-10 my-10">
        
        <img class="w-56 h-56 object-cover shadow-sm shadow-zinc-800/50" src={ picture } alt="" />
        

        <div class="p-3 w-full text-center">
            
            <img class="scale-50 -mt-4 -mb-2" src="imgs/spotify.png" alt=""/>
            <h2 class="mb-1 text-base font-mono font-bold text-zinc-800 uppercase">{ artist }</h2>
            
        </div>
    </div>
</div>

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
</style>
