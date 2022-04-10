import React from 'react';
import { Link } from 'react-router-dom';

// material-ui
import { Box, ButtonBase } from '@material-ui/core';

// project imports
import config from './../../../config';
import Logo from './../../../images/logo.png';
import logo from '../../../images/logo.png';

//-----------------------|| MAIN LOGO ||-----------------------//

const LogoSection = () => {
    return (
        <ButtonBase disableRipple component={Link} to={config.defaultPath}>
            {/* <Logo /> */}
            <Box>
                <img src={logo} width="92" height="52" />
            </Box>
        </ButtonBase>
    );
};

export default LogoSection;
