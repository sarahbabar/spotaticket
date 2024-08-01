<!-- unauthenticated homepage -->
<script lang="ts">
	import { fade } from "svelte/transition";

</script>

<body class="bg-[#27232F] w-screen h-screen flex items-center justify-center">
    <!-- <h1 class="text-4xl">Spotaticket</h1> -->

    <div in:fade class="">
        <a href="/callback">
            <button class="uppercase rounded-sm bg-amber-100 text-[#27232F] font-medium text-2xl p-3  m-3 hover:scale-110 transition duration-200 ease-in-out">Login Using Spotify</button>
        </a>

    </div>

</body>