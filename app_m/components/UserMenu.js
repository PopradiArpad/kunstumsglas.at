/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 
import React, {PropTypes}  from 'react';

const UserMenu = ({user, onLogout, onNewPassword}) => {
    if (! user)
      return null;

    return (
      <div className="kugm-usermenu">
        <div className="kugm-usermenu-name">
          {user.name}
        </div>
        <div className="kugm-usermenu-new_password" onClick={onNewPassword}>
          Neues Passwort
        </div>
        <div className="kugm-usermenu-logout" onClick={onLogout}>
          logout
        </div>
      </div>
    );
}
UserMenu.propTypes = {
  user:          PropTypes.object.isRequired,
  onLogout:      PropTypes.func,
  onNewPassword: PropTypes.func
}

export default UserMenu;
