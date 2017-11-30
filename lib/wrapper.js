'use babel';

import WrapperView from './wrapper-view';
import { CompositeDisposable } from 'atom';

export default {

  wrapperView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.wrapperView = new WrapperView(state.wrapperViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.wrapperView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'wrapper:wrap': () => this.wrap()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.wrapperView.destroy();
  },

  serialize() {
    return {
      wrapperViewState: this.wrapperView.serialize()
    };
  },

  wrap() {
    console.log('Wrapper was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
