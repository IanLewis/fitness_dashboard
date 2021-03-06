/*
Copyright 2015 Google Inc. All Rights Reserved.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

import React, {PropTypes} from 'react';

import { browserHistory } from 'react-router';

import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';
import IconButton from 'material-ui/IconButton';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import LinearProgress from 'material-ui/LinearProgress';

import ActivityChart from './ActivityChart';

var Main = React.createClass({
  getInitialState: function() {
    return {
      ready: false
    };
  },

  gotoSettings: function() {
    browserHistory.push("/settings");
  },

  gotoAuthorize: function() {
    browserHistory.push("/authorize");
  },

  refreshChart: function() {
    this.refs.chart.refresh();
  },

  unlink: function() {
    var self = this;

    google.script.run.withSuccessHandler(function() {
      self.gotoAuthorize();
    }).withFailureHandler(function(msg) {
      alert(msg);
      location.reload();
    }).unlink();
  },

  contextTypes: {
    muiTheme: PropTypes.object.isRequired,
  },

  componentWillMount: function() {
    var self = this;

    google.script.run.withSuccessHandler(function(appStatus) {
      if (!appStatus.isSetup) {
        self.gotoSettings();
        return
      }

      if (!appStatus.hasAccess) {
        self.gotoAuthorize();
        return
      }
      self.setState({ready: true});
    }).withFailureHandler(function(msg) {
      alert(msg);
      location.reload();
    }).getAppStatus();
  },

  render: function() {
    if (this.state.ready) {
      const styles = {backgroundColor: this.context.muiTheme.appBar.color};
      const textStyles = {color: this.context.muiTheme.appBar.textColor};
      const iconButtonIconStyle = {
        fill: this.context.muiTheme.appBar.textColor,
        color: this.context.muiTheme.appBar.textColor,
      };

      return (
        <div>
          <Toolbar style={styles}>
            <ToolbarGroup>
              <ToolbarTitle text="Activity" style={textStyles} />
            </ToolbarGroup>
            <ToolbarGroup>
              <FlatButton
                label="Refresh"
                icon={<FontIcon className="material-icons">refresh</FontIcon>}
                onTouchTap={this.refreshChart}
                style={textStyles}
              />
              <IconMenu
                iconButtonElement={
                  <IconButton iconStyle={iconButtonIconStyle}><MoreVertIcon /></IconButton>
                }
                targetOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'top'}}
              >
                <MenuItem
                  primaryText="Settings"
                  onTouchTap={this.gotoSettings}
                />
                <MenuItem
                  primaryText="Unlink Google Fit"
                  onTouchTap={this.unlink}
                />
              </IconMenu>
            </ToolbarGroup>
          </Toolbar>
          <ActivityChart ref="chart" />
        </div>
      );
    } else {
      return (
        <LinearProgress mode="indeterminate" />
      )
    }
  }
});

export default Main;
