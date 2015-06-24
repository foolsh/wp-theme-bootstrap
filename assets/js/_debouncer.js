/**
 * Event Debouncer
 *
 */
class Debouncer {
	/**
	 * Register an event
	 * Debounce handler on
	 * a specific target
	 *
	 * @param events string
	 * @param target
	 */
	constructor(events, target) {
		let self = this;

		// properties
		self._target = target || window;
		self._callbacks = [];
		self._running = false;

		self.addListeners(events);
	}


	/**
	 * Register the Debouncer to
	 * one or more events
	 *
	 * @param events string
	 */
	addListeners(events) {
		let self = this;

		if ('string' !== typeof events) {
			throw new TypeError('Debouncer: Debouncer can only debounce events of type string');
		}

		self._events = self._events ? self._events.split(' ').concat(events.split(' ')).join(' ') : events;

		if (window.addEventListener) {
			self._target.addEventListener(events, self._bouncer.bind(self), false);
		} else {
			let eventsList = events.split(' ').map(event => `on${event}`);

			if (window.attachEvent) {
				self._target.attachEvent(eventsList.join(' '), self._bouncer.bind(self));
			} else {
				eventsList.forEach(event => self._target[event] = self._bouncer.bind(self));
			}
		}
	}


	/**
	 * Deregister the Debouncer
	 * from one or more events
	 *
	 * @param events string
	 * @param hard bool (default:false) totally deregister events from the Debouncer
	 */
	removeListeners(events, hard) {
		let self = this;

		if ('string' !== typeof events) {
			throw new TypeError('Debouncer: Debouncer can only debounce events of type string');
		}

		if (hard) {
			// if hard option enabled then remove
			// the events from the "events" property
			// of the Debouncer
			let registered = self._events.split(' ');

			events.split(' ').forEach(event => {
				let indexOfEvent = registered.indexOf(event);
				if (-1 < indexOfEvent) {
					registered.splice(indexOfEvent, 1);
				}
			});

			self._events = registered.join(' ');
		}

		if (window.removeEventListener) {
			self._target.removeEventListener(events, self._bouncer.bind(self), false);
		} else {
			let eventsList = events.split(' ').map(event => `on${event}`);

			if (window.detachEvent) {
				self._target.detachEvent(eventsList.join(' '), self._bouncer.bind(self));
			} else {
				eventsList.forEach(event => self._target[event] = null);
			}
		}
	}


	/**
	 * Run all attached callbacks
	 * if there aren't any already
	 * running
	 *
	 * @private
	 * @param event
	 */
	_bouncer(event) {
		let self = this;

		if (!self._running && self._callbacks.length) {
			self._running = true;
			window.requestAnimationFrame(() => {
				self._callbacks.forEach(cb => cb(event));
				self._running = false;
			});
		}
	}


	/**
	 * Attach a new callback
	 * to the Debouncer
	 *
	 * @param callback
	 * @returns {Number}
	 */
	register(callback) {
		let self = this;

		if ('function' !== typeof callback) {
			throw new TypeError('Debouncer: registered callback must be callable');
		}

		if (!self._callbacks.length) {
			self.addListeners(self._events);
		}

		return self._callbacks.push(callback);
	}


	/**
	 * Remove a callback from
	 * the array of callbacks
	 * attached to the
	 * Debouncer
	 *
	 * @param callback
	 * @returns {Number}
	 */
	deregister(callback) {
		let self = this;

		if ('function' !== typeof callback) {
			throw new TypeError('Debouncer: registered callback must be callable');
		}

		let indexOfCb = self._callbacks.indexOf(callback);
		if (-1 < indexOfCb) {
			self._callbacks.splice(indexOfCb, 1);
		}

		if (!self._callbacks.length) {
			self.removeListeners(self._events);
		}

		return indexOfCb;
	}
}

export default Debouncer;