<script>
    import "../app.css";
</script>
  
<slot />

<svelte:head>
    <title>TopArtists</title>
    <meta name="description" content="Your top artists on spotify" />
    <meta name="keywords" content="Spotify, Music, Artist" />

    <meta property="og:title" content="TopArtists" />
    <meta property="og:description" content="Your top artists on spotify" />

    <meta name="twitter:title" content="TopArtists"  />
    <meta name="twitter:description" content="Your top artists on spotify" />

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
