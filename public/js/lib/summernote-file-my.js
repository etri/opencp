/* eslint-disable */

;(function (factory) {
  /* global define */
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory)
  } else if (typeof module === 'object' && module.exports) {
    // Node/CommonJS
    module.exports = factory(require('jquery'))
  } else {
    // Browser globals
    factory(window.jQuery)
  }
})(function ($) {
  // Extends plugins for adding hello.
  //  - plugin is external module for customizing.

  $.extend($.summernote.options, {
    existFileList: [],
    uploadFileList: [],
    callbacks: {
      onFileUpload: null,
      onFileUploadError: null,
      onFileRemove: null
    }
  })

  $.extend($.summernote.plugins, {
    /**
     * @param {Object} context - context object has status of editor.
     */
    file: function (context) {

      // ui has renders to build ui elements.
      //  - you can create a button with `ui.button`
      const ui = $.summernote.ui

      // add hello button
      context.memo('button.file', function () {
        const $fileList = `<div class="note-upload-file-list"></div>`
        // create button
        const button = ui.button({
          contents:
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14px" height="16px"><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456c13.3 0 24-10.7 24-24s-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24z"/></svg>',
          tooltip: '파일 업로드',
          container: $('.note-editor.note-frame'),
          click: function () {
            $inputFile.trigger('click')
          }
        })

        // create jQuery object from button instance.
        const $hello = button.render()
        return $hello
      })

      $editable = context.layoutInfo.editable
      $editor = context.layoutInfo.editor
      
      $inputFile = $('<input id="upload-file-input" type="file" multiple/>')

      $inputFile.change(function(e) {
        const fileList = context.options.uploadFileList

        fileList.push(...e.target.files)

        for (const file of e.target.files) {

        }
      })
      
      $editor.append($inputFile)
      $editable.after('<div class="note-upload-file-list"></div>')

      this.method = function (file) {
        console.log('hello')
      }

      this.removeFile = function (file) {
        const fileList = context.options.uploadFileList
        fileList.remove(file)

        if (context.options.callbacks.onFileRemove) {
          context.options.callbacks.onFileRemove(file)
        }
      }

    }
  })
})
