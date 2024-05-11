<script lang="ts">
    
    export let data;
    const { artists } = data;
    const { profile } = data;
    const { player } = data;

</script>

<h1 class="text-3xl">{profile.display_name}'s Top Artists</h1>

<!-- <p>{player.item.name}</p> -->

<ul>
    {#each artists as artist}
        <li class="text-2xl text-black">{artist.name}</li>
        <img src={artist.images[0].url} alt="artist img" class="rounded-full" width="200" height="200">
    {/each}

</ul>

