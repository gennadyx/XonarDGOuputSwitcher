 /*
  * Copyright 2015 Gennady <gennadyx5@gmail.com>
  *
  * This program is free software: you can redistribute it and/or modify
  * it under the terms of the GNU General Public License as published by
  * the Free Software Foundation, either version 3 of the License, or
  * (at your option) any later version.
  *
  * This program is distributed in the hope that it will be useful,
  * but WITHOUT ANY WARRANTY; without even the implied warranty of
  * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  * GNU General Public License for more details.
  *
  * You should have received a copy of the GNU General Public License
  * along with this program.  If not, see <http://www.gnu.org/licenses/>.
  */
  
const Lang = imports.lang;
//const Signals = imports.signals;
const St = imports.gi.St;
const PanelMenu = imports.ui.panelMenu;

const Indicator = new Lang.Class({
    Name: 'XonarDgOutputSwicther.Indicator',
    Extends: PanelMenu.Button,
    
    _init: function(extension) {
        this.parent(0, 0);
        this._extension = extension;
        this._label = new St.Label({text: this._extension.getSourceShortcut(),
            style_class: 'label'});
       
        this.actor.add_actor(this._label);
        this.actor.connect('button-press-event', this._onClick.bind(this));
    },
    
    _onClick: function() {
        this._extension.toggleOutputSource();
        this._label.set_text(this._extension.getSourceShortcut());
    },
});
