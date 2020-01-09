import React from 'react';
import faker from 'faker/locale/en_US';
import { Link } from 'react-router-dom';

import { 
    Sidebar,
    UncontrolledButtonDropdown,
    Avatar,
    AvatarAddOn,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from './../../../components';
import { randomAvatar } from './../../../utilities';
import config from './../../../../config';

//const avatarImg = randomAvatar();
//const avatarImg = require.context('./images/avatars/2.jpg')
//const avatarImg = '${config.siteCannonicalUrl}/static/2.jpg';

var avatarImg = null;
var userName = null;
var userEmail = null;

var storedInfo = JSON.parse(localStorage.getItem("userinfo"));
console.log(storedInfo);


// if(storedInfo[0]){
//     const avatarImg = storedInfo[2];  //'/static/imran_avatar.jpg';
//     const userName = storedInfo[3];
//     const userEmail = storedInfo[0];
// } else {
//     const avatarImg = '/static/imran_avatar.jpg';  //'/static/imran_avatar.jpg';
//     const userName = '';
//     const userEmail = '';
//     //window.location = 'http://127.0.0.1:4100/pages/login';
// }

//if (typeof(storedInfo) !== 'undefined' || storedInfo != null) {
if (storedInfo != null) {
        //console.log('sidebarcall');
        console.log('Not Undefined or Not Null');
        avatarImg = storedInfo[2];  //'/static/imran_avatar.jpg';
        userName = storedInfo[3];
        userEmail = storedInfo[0];
} 
// if ((storedInfo == null) || (typeof(storedInfo) === 'undefined') || storedInfo==='') {
//         console.log('Undefined or Null');
//         const avatarImg = '/static/imran_avatar.jpg';  //'/static/imran_avatar.jpg';
//         const userName = '';
//         const userEmail = '';
//     //window.location = 'http://127.0.0.1:4100/pages/login';
// }



const SidebarTopA = () => (
    <React.Fragment>
        { /* START: Sidebar Default */ }
        <Sidebar.HideSlim>
            <Sidebar.Section className="pt-0">
                <Link to="/" className="d-block">
                    <Sidebar.HideSlim>
                        <Avatar.Image
                            size="lg"
                            src={ avatarImg ? avatarImg : '/static/imran_avatar.jpg' }
                            addOns={[
                                <AvatarAddOn.Icon 
                                    className="fa fa-circle"
                                    color="white"
                                    key="avatar-icon-bg"
                                />,
                                <AvatarAddOn.Icon 
                                    className="fa fa-circle"
                                    color="success"
                                    key="avatar-icon-fg"
                                />
                            ]}
                        />
                    </Sidebar.HideSlim>
                </Link>
                
                <UncontrolledButtonDropdown>
                    <DropdownToggle color="link" className="pl-0 pb-0 btn-profile sidebar__link">
                        { userName ? userName : ''}
                        <i className="fa fa-angle-down ml-2"></i>
                    </DropdownToggle>
                    <DropdownMenu persist>
                    <DropdownItem header>
                        { userEmail ? userEmail : ''}
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem tag={ Link } to="/apps/profile-details">
                        My Profile
                    </DropdownItem>
                    <DropdownItem tag={ Link } to="/apps/settings-edit">
                        Settings
                    </DropdownItem>
                    <DropdownItem tag={ Link } to="/apps/billing-edit">
                        Billings
                    </DropdownItem>
                    <DropdownItem divider />                    
                    <DropdownItem tag={ Link } to="/pages/login">
                        <i className="fa fa-fw fa-sign-out mr-2" data="signout"></i>
                        Sign Out
                    </DropdownItem>
                    </DropdownMenu>
                </UncontrolledButtonDropdown>
                <div className="small sidebar__link--muted">
                    {userEmail}
                </div>
            </Sidebar.Section>
        </Sidebar.HideSlim>
        { /* END: Sidebar Default */ }

        { /* START: Sidebar Slim */ }
        <Sidebar.ShowSlim>
            <Sidebar.Section>
                <Avatar.Image
                    size="sm"
                    src={ avatarImg ? avatarImg : '/static/imran_avatar.jpg' }
                    addOns={[
                        <AvatarAddOn.Icon 
                            className="fa fa-circle"
                            color="white"
                            key="avatar-icon-bg"
                        />,
                        <AvatarAddOn.Icon 
                            className="fa fa-circle"
                            color="success"
                            key="avatar-icon-fg"
                        />
                    ]}
                />
            </Sidebar.Section>
        </Sidebar.ShowSlim>
        { /* END: Sidebar Slim */ }
    </React.Fragment>
)

export { SidebarTopA };
