'use babel'

import { CompositeDisposable } from 'atom'

export default {

  activate: function(state) {
    return atom.commands.add('atom-workspace', {
      'wrapper:wrap': () => {
        return this.wrap()
      }
    })
  },
  wrap: function() {
    var editor
    if (editor = atom.workspace.getActiveTextEditor()) {
      return editor.getSelections().map(function(item) {
        return wrapSelection(editor, item)
      })
    }
  }
}

wrapSelection = function(editor, selection) {
  var editorView, endTagSelection, newEndTagSelectRange, newStartTagSelectRange, newText, range, tag, tagRangePos, text
  tag = 'p'
  text = selection.getText()
  tagRangePos = selection.getBufferRange()
  newText = ['<', tag, '>', text, '</', tag, '>'].join('')
  range = {
    start: {
      from: [tagRangePos.start.row, tagRangePos.start.column + 1],
      to: [tagRangePos.start.row, tagRangePos.start.column + 2]
    },
    end: {
      from: [tagRangePos.end.row, tagRangePos.end.column + 5],
      to: [tagRangePos.end.row, tagRangePos.end.column + 6]
    }
  }
  if (range.end.from[0] > range.start.from[0]) {
    range.end.from[1] = range.end.from[1] - 3
    range.end.to[1] = range.end.to[1] - 3
  }
  newStartTagSelectRange = [range.start.from, range.start.to]
  newEndTagSelectRange = [range.end.from, range.end.to]
  selection.insertText(newText)
  selection.cursor.setBufferPosition([tagRangePos.start.row, tagRangePos.start.column + 1])
  editor.addSelectionForBufferRange(newStartTagSelectRange);
  endTagSelection = editor.addSelectionForBufferRange(newEndTagSelectRange)
  editorView = atom.views.getView(editor);
  return editorView.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) {
      endTagSelection.cursor.marker.destroy()
      return this.removeEventListener('keydown', arguments.callee)
    }
  })

}
