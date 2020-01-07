import React from 'react';
import PropTypes from 'prop-types';

const FooterText = (props) => (
	<React.Fragment>
		(C) { props.year } All Rights Reserved.
	</React.Fragment>
)
FooterText.propTypes = {
   
};
FooterText.defaultProps = {
    // year: "2018",
    // name: "Admin Theme",
    // desc: "Bootstrap 4, React 16 (latest) & NPM"
};

export { FooterText };
