<script setup>
import { ref, computed } from 'vue';
import TinyEditor from './components/TinyEditor.vue';

// The host view only imports the component and binds it. All editor logic
// (self-hosting, license, plugins) lives inside <TinyEditor>.
const content = ref(
  '<h2>Hola desde Vue 3 👋</h2><p>Edita este texto con <strong>TinyMCE 8 self-hosted</strong>.</p>'
);

// A plain-text length, handy as a "model is bound" signal in the UI and tests.
const charCount = computed(() => content.value.replace(/<[^>]*>/g, '').length);
</script>

<template>
  <main class="page">
    <header>
      <h1>TinyMCE self-hosted · Vue 3</h1>
      <p>
        Editor cargado desde <code>/tinymce/tinymce.min.js</code> (self-hosted,
        licencia GPL), envuelto en un componente reutilizable
        <code>&lt;TinyEditor v-model&gt;</code>.
      </p>
    </header>

    <TinyEditor v-model="content" />

    <section class="bound">
      <h2>Modelo enlazado (v-model)</h2>
      <p>Caracteres de texto: <strong data-testid="char-count">{{ charCount }}</strong></p>
      <pre data-testid="model-output">{{ content }}</pre>
    </section>
  </main>
</template>

<style>
:root { color-scheme: light; }
body { margin: 0; background: #f4f5f7; }
.page { max-width: 960px; margin: 0 auto; padding: 24px; font-family: -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
header h1 { margin-bottom: 4px; }
header p { color: #444; margin-top: 0; }
code { background: #e9ecef; padding: 1px 5px; border-radius: 4px; }
.bound { margin-top: 24px; }
.bound pre { background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; overflow: auto; white-space: pre-wrap; word-break: break-word; }
</style>
