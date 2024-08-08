<script>
    import "../app.css";
</script>
  
<slot />

<svelte:head>
    <title>SPOTATICKET</title>
    <meta name="description" content="Concerts for your top artists" />
    <meta name="keywords" content="Concert, Spotify, Music, Artist, Ticketmaster, Event" />

    <meta property="og:title" content="SPOTATICKET" />
    <meta property="og:description" content="Concerts for your top artists" />

    <meta name="twitter:title" content="SPOTATICKET"  />
    <meta name="twitter:description" content="Concerts for your top artists" />

    <meta name="theme-color" content="#fef3c7" />
</svelte:head>

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
    :global(.star) {
        cursor: url("$lib/assets/star_cursor_yellow.svg") 12 12, auto;
    } 

    :global(html) {
        cursor: url('$lib/assets/star_cursor.svg') 12 12, auto;
    }
    :global(.apple) {
        cursor: url("$lib/assets/apple.svg") 12 12, auto;
    }
</style>
