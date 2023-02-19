import Constants from "../utils/Constants";

import EventEmitter from "events";

const { AppNotifKey } = Constants;

export default class AppManager {
	static instance = null;
	eventListener = new EventEmitter();
	confirmViewRef = null;
	onPressConfirm = null;

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

	openMasterDrawer = () => {
		this.eventListener.emit(AppNotifKey.OPEN_MASTER_DRAWER);
	};

	closeMasterDrawer = () => {
		this.eventListener.emit(AppNotifKey.CLOSE_MASTER_DRAWER);
	};

	showConfirmView = (title, message, yesButton, noButton, onConfirm) => {
		this.confirmViewRef &&
			this.confirmViewRef.openModal(
				title,
				message,
				yesButton,
				noButton,
				onConfirm
			);
	};

	/*  Store axios request - response  */
}
