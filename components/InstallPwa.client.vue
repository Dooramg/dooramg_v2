<template>
  <div>
    <div
      v-if="$pwa?.offlineReady || $pwa?.needRefresh"
      class="fixed flex flex-col gap-2 right-0 bottom-20 md:bottom-8 m-4 p-2 border-2 rounded-md z-20 text-left shadow-lg bg-zinc-200/80 dark:bg-zinc-700/80"
      role="alert"
    >
      <span>
        {{ $pwa.offlineReady ? $t('pwa.readyPwa') : $t('pwa.newContent') }}
      </span>
      <AButton
        v-if="$pwa.needRefresh"
        custom-class="w-fit"
        :button-text="$t('pwa.reload')"
        button-variant="outline"
        button-size="xs"
        @click="$pwa.updateServiceWorker()"
      />
      <AButton
        custom-class="w-fit"
        :button-text="$t('pwa.close')"
        button-variant="outline"
        button-size="xs"
        @click="$pwa.cancelPrompt()"
      />
    </div>
    <div
      v-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
      class="fixed right-0 bottom-20 md:bottom-8 m-4 p-2 border-2 rounded-md z-20 text-left shadow-lg bg-zinc-200/80 dark:bg-zinc-700/80"
      role="alert"
    >
      <div class="flex flex-col gap-2">
        <div class="flex gap-2 items-center">
          <Icon
            :width="40"
            :height="40"
            name="tabler:devices-down"
          />
          <span>
            {{ $t('pwa.installPwa') }}
          </span>
        </div>
        <div class="flex justify-end gap-2">
          <AButton
            :button-text="$t('pwa.install')"
            button-variant="outline"
            button-size="xs"
            @click="$pwa.install()"
          />
          <AButton
            :button-text="$t('pwa.cancel')"
            button-variant="outline"
            button-size="xs"
            @click="$pwa.cancelInstall()"
          />
        </div>
      </div>
    </div>
  </div>
</template>
