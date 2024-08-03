<!-- unauthenticated homepage -->
<script lang="ts">
	import { PUBLIC_CLIENT_ID, PUBLIC_REDIRECT_URI } from "$env/static/public";

    const scope: string = "user-top-read user-read-private user-read-email user-read-currently-playing";
    const authUrl: string = 
        `https://accounts.spotify.com/authorize?` +
        `client_id=${PUBLIC_CLIENT_ID}` +
        `&response_type=code` +
        `&redirect_uri=${PUBLIC_REDIRECT_URI}` +
        `&scope=${scope}`;
</script>

<main class="bg-[#27232F] w-screen h-screen flex">
    <!-- <h1 class="text-4xl">Spotaticket</h1> -->

    <div class="w-full flex flex-col items-center justify-center">

        <h1 class="font-mono font-bold text-5xl md:text-6xl tracking-wider text-amber-100 text-center mx-2 mt-6 mb-1 uppercase">SpotATicket</h1>

        <h2 class="font-mono text-base md:text-lg text-amber-100 uppercase mt-2 mb-8 mx-2">Concerts for your top artists</h2>

        <a href="{authUrl}">
            <button style="box-shadow:  0px 0px 35px 7px rgba(250, 234, 172, .2);" class="star uppercase rounded-full bg-amber-100 text-[#27232F] font-mono font-bold text-base md:text-xl py-3 px-4 m-2 hover:scale-110 transition duration-300 ease-in-out">Login Using Spotify</button>
        </a>

    </div>

</main>


