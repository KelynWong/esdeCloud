const baseUrl ="https://9ltiw49lic.execute-api.us-east-1.amazonaws.com/esde";
try{
document.getElementById('logoutButton').addEventListener('click', function(event) {
    event.preventDefault();
    localStorage.clear();
    window.location.replace("https://esde.auth.us-east-1.amazoncognito.com/logout?client_id=7nntq9m3qhp9nvhbgnu2vj25hq&logout_uri=https://esdefrontend.s3.amazonaws.com/home.html");
});

}catch(err){}
if (window.self!==window.top){
    alert("Warning! you are being phished");
    try {
		window.top.location.href=window.location.href;
	} catch (error) {
		window.location.href="https://www.youtube.com/embed/dQw4w9WgXcQ";
	}
}
/* send warning to user when devtool is open */
window.addEventListener('devtoolschange', event => {
    if(event.detail.isOpen){
        console.log("%c Warning!!","color: red; font-weight: bold; font-size:5rem;")
        console.log(`%cThis is a browser feature intended for developers. If someone told you to copy and paste something here to enable a some feature or "hack" someone's account, it is a scam and will give them access to your account`,'font-size:2rem;')
    }
});
/**
 * @copyright
devtools-detect
Detect if DevTools is open
https://github.com/sindresorhus/devtools-detect
By Sindre Sorhus
MIT License
*/
(function () {
	'use strict';

	const devtools = {
		isOpen: false,
		orientation: undefined
	};

	const threshold = 160;

	const emitEvent = (isOpen, orientation) => {
		window.dispatchEvent(new CustomEvent('devtoolschange', {
			detail: {
				isOpen,
				orientation
			}
		}));
	};

	const main = ({emitEvents = true} = {}) => {
		const widthThreshold = window.outerWidth - window.innerWidth > threshold;
		const heightThreshold = window.outerHeight - window.innerHeight > threshold;
		const orientation = widthThreshold ? 'vertical' : 'horizontal';

		if (
			!(heightThreshold && widthThreshold) &&
			((window.Firebug && window.Firebug.chrome && window.Firebug.chrome.isInitialized) || widthThreshold || heightThreshold)
		) {
			if ((!devtools.isOpen || devtools.orientation !== orientation) && emitEvents) {
				emitEvent(true, orientation);
			}

			devtools.isOpen = true;
			devtools.orientation = orientation;
		} else {
			if (devtools.isOpen && emitEvents) {
				emitEvent(false, undefined);
			}

			devtools.isOpen = false;
			devtools.orientation = undefined;
		}
	};

	main({emitEvents: false});
	setInterval(main, 500);

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = devtools;
	} else {
		window.devtools = devtools;
	}
})();

