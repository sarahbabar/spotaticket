<!-- unauthenticated homepage -->
<script lang="ts">
	import { fade } from "svelte/transition";

</script>

<body class="bg-violet-300 w-screen h-screen flex items-center justify-center">
    <!-- <h1 class="text-4xl">Spotaticket</h1> -->

    <div in:fade class="">
        <a href="/callback">
            <button class="bg-yellow-100 text-violet-900 font-medium text-2xl p-3 rounded-xl m-3 hover:scale-110 transition duration-200 ease-in-out">Login Using Spotify</button>
        </a>
    </div>

</body>
    


