import angular from 'angular';
import { TINY_EDITOR_MODULE } from './tiny-editor.module.js';

/**
 * <tiny-editor ng-model="..."> — reusable AngularJS component that wraps the
 * self-hosted TinyMCE 8 editor and behaves like a normal ngModel form control.
 *
 * Usage (after declaring TINY_EDITOR_MODULE as a dependency of your module):
 *   <tiny-editor ng-model="vm.content"></tiny-editor>
 *   <tiny-editor ng-model="vm.content" init="{ height: 300 }"></tiny-editor>
 *
 * It loads from the global `window.tinymce` provided by the self-hosted
 * /tinymce/tinymce.min.js and declares the GPL license key (no API key needed).
 */

// Rich default config: every open-source plugin bundled with TinyMCE 8.
// (Premium plugins are intentionally omitted — not part of the GPL package.)
const DEFAULT_INIT = {
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

function TinyEditorController($element, $scope) {
  const $ctrl = this;
  let editor = null;

  $ctrl.$postLink = function () {
    const textarea = $element[0].querySelector('textarea');
    const tinymce = window.tinymce;

    if (!tinymce) {
      console.error(
        '[tiny-editor] window.tinymce not found. Is /tinymce/tinymce.min.js loaded?'
      );
      return;
    }

    tinymce.init({
      target: textarea,
      license_key: 'gpl',
      ...DEFAULT_INIT,
      ...($ctrl.init || {}),
      setup(ed) {
        editor = ed;

        ed.on('init', function () {
          // Push the current model value into the freshly created editor.
          if ($ctrl.ngModelCtrl) {
            ed.setContent($ctrl.ngModelCtrl.$viewValue || '');
          }
        });

        // Editor -> model.
        ed.on('change keyup input undo redo SetContent', function () {
          const html = ed.getContent();
          if (!$ctrl.ngModelCtrl || $ctrl.ngModelCtrl.$viewValue === html) return;
          $scope.$applyAsync(function () {
            $ctrl.ngModelCtrl.$setViewValue(html);
          });
        });
      },
    });

    // Model -> editor (programmatic updates after init).
    if ($ctrl.ngModelCtrl) {
      $ctrl.ngModelCtrl.$render = function () {
        const value = $ctrl.ngModelCtrl.$viewValue || '';
        if (editor && editor.initialized && editor.getContent() !== value) {
          editor.setContent(value);
        }
      };
    }
  };

  $ctrl.$onDestroy = function () {
    if (editor) {
      editor.remove();
      editor = null;
    }
  };
}

TinyEditorController.$inject = ['$element', '$scope'];

angular.module(TINY_EDITOR_MODULE).component('tinyEditor', {
  template: '<textarea class="tiny-editor__textarea"></textarea>',
  require: { ngModelCtrl: 'ngModel' },
  bindings: {
    init: '<',
  },
  controller: TinyEditorController,
});
