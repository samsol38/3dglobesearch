import Constants from "../utils/Constants";

import EventEmitter from "events";

const { AppNotifKey } = Constants;

export default class AppManager {
	static instance = null;
	eventListener = new EventEmitter();

	/**
	 * @returns {AppManager}
	 **/

	static getInstance() {
		if (AppManager.instance == null) {
			AppManager.instance = new AppManager();
		}

		return this.instance;
	}

	/*  Public Interface Methods */

	/*  UI Events Methods   */

	addEventListener = (eventType, callback) => {
		this.eventListener.on(eventType, callback);
	};

	removeEventListener = (eventType, callback) => {
		this.eventListener.removeListener(eventType, callback);
	};

	showFavPlaceItem = (favPlaceItem) => {
		this.eventListener.emit(AppNotifKey.SHOW_FAV_PLACE, favPlaceItem);
	};

	/*  Store axios request - response  */
}
