window.addEventListener('message', function(event) {
	
	if (event.source !== window) {
		return;
	}

	var message = event.data;

	// Only accept messages that we know are ours
	if (typeof message !== 'object' || message === null ) {
		return;
	}

	chrome.runtime.sendMessage(message);
});