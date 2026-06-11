import angular from 'angular';
import { TINY_EDITOR_MODULE } from './tiny-editor.module.js';

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
          if ($ctrl.ngModelCtrl) {
            ed.setContent($ctrl.ngModelCtrl.$viewValue || '');
          }
        });

        ed.on('change keyup input undo redo SetContent', function () {
          const html = ed.getContent();
          if (!$ctrl.ngModelCtrl || $ctrl.ngModelCtrl.$viewValue === html) return;
          $scope.$applyAsync(function () {
            $ctrl.ngModelCtrl.$setViewValue(html);
          });
        });
      },
    });

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
