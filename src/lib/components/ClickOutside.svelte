<script lang="ts">
    import { createEventDispatcher } from "svelte";

    let _this: HTMLDivElement;
    const dispatch = createEventDispatcher();
        
    function handleClick(event: MouseEvent) {
        event.target && 
        !event.defaultPrevented && 
        !_this.contains(event.target as Node) &&
        dispatch("clickoutside");
    }
</script>

<svelte:document on:click={handleClick} />
<div bind:this={_this} style="width: min-content; height: min-content">
    <slot />
</div>
