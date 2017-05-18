/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, {PropTypes, Component } from 'react';
import {connect}                      from 'react-redux';
import {SetArtist}                    from '../actions';

class Artist extends Component {
  constructor() {
    super(...arguments);

    this.dispatchSetArtistIfNeeded(this.props);
  }

  render() {
    const artist = this.props.artist;

    if (! artist)
      return null;

    const html = {__html:artist.contact_html};
    return (
      <div className="kug-artist">
        <div className="kug-artist-img">
          <img src={`/item/${artist.id}/smallPic?dbModel=User`} />
        </div>
        <div className="kug-artist-contact" dangerouslySetInnerHTML={html}/>
      </div>
    );
  }

  dispatchSetArtistIfNeeded(props) {
    //url takes precedence over state to let refresh work
    if (! props.artist || (props.artist.name !== props.params.artistName))
      this.props.dispatch(new SetArtist(props.params.artistName));
  }

}
Artist.propTypes = {
  artist:      PropTypes.object,
  dispatch:    PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
          artist: state.artist.artist
         };
}

export default connect(mapStateToProps)(Artist);
