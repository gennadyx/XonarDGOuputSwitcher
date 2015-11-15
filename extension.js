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
  
const GLib = imports.gi.GLib;
const Lang = imports.lang;
const Panel = imports.ui.main.panel;
const Extensions = imports.misc.extensionUtils;
const Local = Extensions.getCurrentExtension();
const Indicator = Local.imports.indicator;

const Extension = new Lang.Class({
    Name: 'XonarDgOutputSwicther',
    
    _outputSourcesShortcuts: {
        'Stereo Headphones FP': 'FP',
        'Stereo Headphones': 'BP'
    },
    
    _init: function() {
        this._detectXonarCard();
        
        this._lastOutputSource = this._getLastOutputSource();
        this._createIndicator();
    },
    
    _detectXonarCard: function() {
        let [res, out] = GLib.spawn_command_line_sync('cat /proc/asound/cards');
        this._soundCardId = /([0-9]) \[DG +\]/.exec(out)[1];
    },
    
    _createIndicator: function() {
        this._indicator = new Indicator.Indicator(this);
        Panel.addToStatusArea('xonardg-output', this._indicator, 0)
    },
    
    getSourceShortcut: function() {
        return this._outputSourcesShortcuts[this._lastOutputSource];
    },
    
    _getLastOutputSource: function() {
        let [res, out] = GLib.spawn_command_line_sync('amixer -c '
            + this._soundCardId + ' sget "Analog Output"');
            
        return this._parseAmixerOutput(out);
    },
    
    toggleOutputSource: function() {
        let setSource = this._lastOutputSource == 'Stereo Headphones' 
          ? 'Stereo Headphones FP' : 'Stereo Headphones';
          
        let [res, out] = GLib.spawn_command_line_sync('amixer -c '
            + this._soundCardId + ' sset "Analog Output" "' + setSource + '"');
        this._lastOutputSource = this._parseAmixerOutput(out);
    },
    
    _parseAmixerOutput: function(out) {
        return /Item0: \'([a-zA-Z ]+)\'/.exec(out)[1];
    },
    
    destroy: function() {
        this._indicator.destroy();
        this.parent();
    }
});

/**
 * init
 * run when gnome-shell loads
 */
 
let _extension = null;

function init() {
    
}

function enable() {
    _extension = new Extension();
}

function disable() {
  _extension.destroy();
  _extension = null;
}

