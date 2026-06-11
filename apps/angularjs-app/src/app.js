import angular from 'angular';
import { TINY_EDITOR_MODULE } from './tiny-editor/tiny-editor.module.js';

// The host app just declares the editor module as a dependency and uses the
// <tiny-editor> tag in its view. No editor logic lives here.
angular
  .module('app', [TINY_EDITOR_MODULE])
  .controller('MainController', function MainController() {
    const vm = this;

    vm.content =
      '<h2>Hola desde AngularJS 👋</h2>' +
      '<p>Edita este texto con <strong>TinyMCE 8 self-hosted</strong>.</p>';

    vm.charCount = function () {
      return (vm.content || '').replace(/<[^>]*>/g, '').length;
    };
  });
