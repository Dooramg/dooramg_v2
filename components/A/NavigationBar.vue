<template>
  <div class="fixed bottom-0 flex flex-col justify-between items-center bg-red-100 gap-4">
    <div class="w-dvw md:w-[500px] fixed bottom-0 flex justify-between items-center border-t-2 p-2 border-amber-800 dark:border-amber-300">
      <NuxtLink
        class="w-fit py-2 px-4 flex flex-col justify-center items-center gap-1 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-700"
        to="/"
      >
        <Icon
          name="game-icons:full-motorcycle-helmet"
          :width="28"
          :height="28"
        />
        <span class="text-xs">
          {{ $t('buttons.home') }}
        </span>
      </NuxtLink>
      <NuxtLink
        class="w-fit py-2 px-4 flex flex-col justify-center items-center gap-1 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-700"
        to="/vehicles"
      >
        <Icon
          name="ph:person-simple-bike-duotone"
          :width="28"
          :height="28"
        />
        <span class="text-xs">
          {{ $t('buttons.vehicles') }}
        </span>
      </NuxtLink>
      <NuxtLink
        class="w-fit py-2 px-4 flex flex-col justify-center items-center gap-1 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-700"
        to="/diary"
      >
        <Icon
          name="line-md:list-3-twotone"
          :width="28"
          :height="28"
        />
        <span class="text-xs">
          {{ $t('buttons.diary') }}
        </span>
      </NuxtLink>
      <NuxtLink
        class="w-fit py-2 px-4 flex flex-col justify-center items-center gap-1 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-700"
        to="/community"
      >
        <Icon
          name="solar:clipboard-list-outline"
          :width="28"
          :height="28"
        />
        <span class="text-xs">
          {{ $t('buttons.community') }}
        </span>
      </NuxtLink>
      <NuxtLink
        class="w-fit py-2 px-4 flex flex-col justify-center items-center gap-1 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-700"
        to="/setting"
      >
        <Icon
          name="line-md:cog-loop"
          :width="28"
          :height="28"
        />
        <span class="text-xs">
          {{ $t('buttons.setting') }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>
