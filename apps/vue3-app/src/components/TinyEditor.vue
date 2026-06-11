<script setup>
import { computed } from 'vue';
import Editor from '@tinymce/tinymce-vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  init: { type: Object, default: () => ({}) },
  disabled: { type: Boolean, default: false },
});

const emit = defineEmits(['update:modelValue']);

const value = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const defaultInit = {
  height: 480,
  menubar: 'file edit view insert format tools table help',
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
    'codesample', 'nonbreaking', 'pagebreak', 'quickbars',
  ],
  toolbar:
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough forecolor backcolor | ' +
    'alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | ' +
    'link image media table emoticons charmap codesample | code preview fullscreen | help',
  content_style:
    'body { font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; font-size: 15px; }',
};

const mergedInit = computed(() => ({ ...defaultInit, ...props.init }));
</script>

<template>
  <Editor
    v-model="value"
    license-key="gpl"
    tinymce-script-src="/tinymce/tinymce.min.js"
    :disabled="disabled"
    :init="mergedInit"
  />
</template>
