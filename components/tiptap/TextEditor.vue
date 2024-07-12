<script setup lang="ts">
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import { Youtube } from '@tiptap/extension-youtube'
import { FontFamily } from '@tiptap/extension-font-family'
import { Color } from '@tiptap/extension-color'
import starterKit from '@tiptap/starter-kit'
import textStyle from '@tiptap/extension-text-style'
import placeholder from '@tiptap/extension-placeholder'
import characterCount from '@tiptap/extension-character-count'
import underline from '@tiptap/extension-underline'
import textAlign from '@tiptap/extension-text-align'
import highlight from '@tiptap/extension-highlight'
import focus from '@tiptap/extension-focus'
import taskItem from '@tiptap/extension-task-item'
import taskList from '@tiptap/extension-task-list'
import link from '@tiptap/extension-link'

const { t } = useLocale()
const { width: windowWidth } = useWindowSize()
const { BaseCustomMediaNode } = useTiptapImage()

const characterCountLimit = ref(0)
const hyperLinkDialogTrigger = ref(false)
const youtubeLinkDialogTrigger = ref(false)
const imageUploadDialogTrigger = ref(false)

const props = withDefaults(
  defineProps<{
    textData?: string
    textLimit?: number
    fullOption?: boolean
    commentOption?: boolean
  }>(),
  {
    textData: '',
    textLimit: 300,
    fullOption: false,
    commentOption: false,
  },
)

const emits = defineEmits([
  'update:model-value',
])

const editor = ref()

watch(
  () => props.textData,
  (value) => {
    const isSame = editor.value.getHTML() === value
    if (!isSame) {
      editor.value.commands.setContent(value, false)
    }
  },
)

onMounted(() => {
  editor.value = new Editor({
    content: props.textData,
    editable: true,
    editorProps: {
      attributes: {
        class: '',
      },
    },
    extensions: [
      starterKit,
      placeholder.configure({
        emptyEditorClass: 'p-2',
        placeholder: t('validate.inputContent'),
      }),
      characterCount.configure({
        limit: characterCountLimit.value,
      }),
      underline,
      textAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      highlight.configure({ multicolor: true }),
      focus.configure({
        className: 'has-focus',
        mode: 'all',
      }),
      taskItem.configure({
        nested: true,
      }),
      taskList,
      link.configure({
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          target: '_blank',
        },
        protocols: ['ftp', 'mailto'],
        openOnClick: true,
      }),
      textStyle,
      Youtube.configure({
        progressBarColor: 'white',
        interfaceLanguage: 'ko',
        modestBranding: true,
        width: 400,
        height: 280,
      }),
      FontFamily,
      BaseCustomMediaNode,
      Color,
    ],
    onUpdate: ({ editor }) => {
      emits('update:model-value', editor.getHTML(), editor.state.doc.textContent)
    },
  })
})

onBeforeUnmount(() => {
  editor.value?.destroy()
  editor.value = null
})

const submitHyperLink = (link: string) => {
  link
    ? editor.value?.chain().focus().setLink({ href: link, target: '_blank' }).run()
    : editor.value?.chain().focus().unsetLink().run()
}

const submitYoutubeLink = (link: string) => {
  editor.value?.commands.setYoutubeVideo({
    src: link,
    width: windowWidth.value > 600 ? 400 : windowWidth.value - 100,
    height: windowWidth.value > 600 ? 280 : 200,
  })
}

const submitImage = (imageUrl: string, hyperLink: string) => {
  editor.value?.chain().focus().setImage({ src: imageUrl, href: hyperLink === '' ? undefined : hyperLink }).run()
}
</script>

<template>
  <div
    v-if="editor"
    class="flex flex-col w-full border-2 rounded-md border-neutral-600 dark:border-neutral-300"
  >
    <div class="flex items-center gap-2 p-2 flex-wrap border-b-2 border-neutral-600 dark:border-neutral-300">
      <TiptapFontFamilyGroup
        :tiptap-editor="editor"
        :full-option="fullOption"
      />
      <TiptapHeadingGroup
        :tiptap-editor="editor"
        :full-option="!commentOption && fullOption"
      />
      <TiptapEditNormalButtons
        v-if="!commentOption && fullOption"
        :action="() => editor ? imageUploadDialogTrigger = true : null"
        icon-type="ri:image-2-line"
        :tooltip-text="$t('tiptap.image')"
      />
      <TiptapTextStyleGroup
        :tiptap-editor="editor"
        :full-option="fullOption"
      />
      <TiptapStrokeGroup
        v-if="!commentOption"
        :tiptap-editor="editor"
        :full-option="fullOption"
      />
      <TiptapTextAlignGroup
        v-if="!commentOption"
        :tiptap-editor="editor"
        :full-option="fullOption"
      />
      <TiptapTextListGroup
        v-if="!commentOption"
        :tiptap-editor="editor"
        :full-option="fullOption"
      />
      <TiptapLinkGroup
        v-if="!commentOption"
        :tiptap-editor="editor"
        :full-option="fullOption"
        @open:hyper-link="() => hyperLinkDialogTrigger = true"
        @open:youtube-link="() => youtubeLinkDialogTrigger = true"
      />
      <TiptapExtraGroup
        v-if="!commentOption"
        :tiptap-editor="editor"
        :full-option="fullOption"
      />
      <EditNormalButtons
        :is-active="false"
        :action="() => editor ? editor.commands.clearContent(): null"
        icon-type="ri:close-circle-line"
        :tooltip-text="$t('tiptap.clear')"
      />
    </div>
    <bubble-menu
      class="bubble-menu flex gap-2 w-fit border-2 rounded-md bg-neutral-200 dark:bg-neutral-800 border-neutral-600 dark:border-neutral-300"
      :tippy-options="{ duration: 100 }"
      :editor="editor"
    >
      <TiptapEditNormalButtons
        :is-active="editor?.isActive('bold')"
        :action="() => editor ? editor.chain().focus().toggleBold().run() : null"
        icon-type="ri:bold"
        :tooltip-text="$t('tiptap.bold')"
        :tooltip-trigger="false"
      />
      <TiptapEditNormalButtons
        :is-active="editor?.isActive('underline')"
        :action="() => editor ? editor.chain().focus().toggleUnderline().run() : null"
        icon-type="ri:underline"
        :tooltip-text="$t('tiptap.underline')"
        :tooltip-trigger="false"
      />
      <TiptapEditNormalButtons
        :is-active="editor?.isActive('highlight')"
        :action="() => editor ? editor.chain().focus().toggleHighlight().run() : null"
        icon-type="ri:mark-pen-fill"
        :tooltip-text="$t('tiptap.marker1')"
        :tooltip-trigger="false"
      />
      <TiptapEditNormalButtons
        :is-active="editor?.isActive('link')"
        :action="() => editor ? hyperLinkDialogTrigger = true : null"
        icon-type="ri:link"
        :tooltip-text="$t('tiptap.link')"
        :tooltip-trigger="false"
      />
      <TiptapEditNormalButtons
        v-if="fullOption"
        :is-active="editor?.isActive({ textAlign: 'center' })"
        :action="() => editor ? editor.chain().focus().setTextAlign('justify').run() : null"
        icon-type="ri:menu-line"
        :tooltip-text="$t('tiptap.alignCenter')"
        :tooltip-trigger="false"
      />
    </bubble-menu>
    <editor-content
      class="p-2 m-3"
      :editor="editor"
    />
    <div class="flex flex-col items-end p-2">
      <p>
        {{ editor?.storage.characterCount.characters() + ' / '.concat(String(textLimit), $t('tiptap.characters')) }}
      </p>
    </div>
    <DialogHyperLink
      v-model:dialog-trigger="hyperLinkDialogTrigger"
      @submit:link="submitHyperLink"
      @close:dialog="(trigger:boolean) => hyperLinkDialogTrigger = trigger"
    />
    <DialogYoutubeLink
      v-model:dialog-trigger="youtubeLinkDialogTrigger"
      @submit:link="submitYoutubeLink"
      @close:dialog="(trigger:boolean) => youtubeLinkDialogTrigger = trigger"
    />
    <DialogImageUpload
      v-model:dialog-trigger="imageUploadDialogTrigger"
      @submit:image="submitImage"
      @close:dialog="(trigger:boolean) => imageUploadDialogTrigger = trigger"
    />
  </div>
</template>

<style lang="scss">
.tiptap p.is-empty::before {
  color: #adb5bd;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}
</style>
