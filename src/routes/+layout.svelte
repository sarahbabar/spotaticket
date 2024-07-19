<script>
    import "../app.css";
</script>
  
<slot />

<style lang="postcss">
    :global(::-webkit-scrollbar) {
        width: 12px;
    }

    /* Track */
    :global(::-webkit-scrollbar-track) {
        @apply bg-[#4b4359];
        @apply rounded-full
    }

    /* Handle */
    :global(::-webkit-scrollbar-thumb) {
        @apply bg-amber-100;
        @apply rounded-full;
    }

    /* Handle on hover */
    :global(::-webkit-scrollbar-thumb:hover) {
        @apply bg-amber-100/70;
    }
</style>