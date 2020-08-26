import axios from 'axios';
import jwt from 'jsonwebtoken';

import { signRequest } from '@applicaster/zapp-pipes-provider-applicaster/lib/provider/api/signRequest';
import atomFormatter from '@applicaster/zapp-pipes-provider-applicaster/lib/provider/atomFormatter';

export function getChannelList(params, nativeBridge) {
	const {
		accountId,
		bundleIdentifier,
		apiSecretKey,
		uuid
	} = nativeBridge.appData()

	const baseUrl = `https://admin.applicaster.com/v12/accounts/${accountId}`

	function generateToken(timestamp) {
		const secret = "AViqL8rxVraFMtoa58nR6H4pfXZzXUmdxTwhFhB7";
		const name = "Sportsmax"

		const expiryTimestamp = Math.round(timestamp / 1000) + (60 * 100);

		const header = {
			"alg": "HS256",
			"typ": "JWT"
		}

		const data = {
			"iss": name,
			"exp": expiryTimestamp,
			"uuid": uuid
		}

		var token = jwt.sign(data, secret, { header });
		return token;
	}

	function getChannelsFeed(channels) {
		return {
			"type": {
				"value": "feed"
			},
			"id": "channel-list",
			"title": "SportMax Channel List",
			"entry": channels || []
		}
	}

	function getChannelEntry(item) {
		const channel = atomFormatter("channel", item);

		let free = false;
		let authProviders = item["channel"]["authorization_providers_ids"];

		if (authProviders && authProviders.length) {
			authProviders = authProviders.map(item => item.toString())
		} else {
			free = true;
		}

		return {
			"id": channel["id"],
			"title": channel["title"],
			"type": {
				"value": "video"
			},
			"content": channel["content"],
			"media_group": channel["media_group"],
			"extensions": {
				free,
				"channel_id": channel["ui_tag"],
				"ds_product_ids": authProviders
			}
		}
	}

	function sortParams(params) {
		var result = {};

    Object.keys(params).sort().forEach(function(key) {
      result[key] = params[key];
		});

    return result;
  }

	function getAuthRequest(url) {
		const timestamp = new Date().getTime();

		const params = {
			timestamp,
			"ver": "1.2",
			"bver": "2.5",
			"store": "ios",
			"bundle": bundleIdentifier,
			uuid
		};

		const signedParams = signRequest(
			url,
			apiSecretKey,
			sortParams(params)
		);

		const signedUrl = `${url}?${signedParams}`;

		const authProvider = { "179": generateToken(timestamp) };
		const headers = {
			"Authorization-Tokens": JSON.stringify(authProvider)
		};

		const request = {
			url: signedUrl,
			headers
		};

		return request;
	}

	function loadApplicasterChannel(item, callback) {
		const url = `${baseUrl}/channels/${item.id}.json`;

		const request = getAuthRequest(url);

		axios(request).then(response => {
			var channel = response.data;

			if (!channel) {
				callback(false);
				return;
			}

			callback(true, channel);
		})
		.catch(e => callback(false));
	}

	function handleApplicasterChannelsCollection(collection, callback) {
		const items = collection["results"];

		if (!items) {
			callback(false);
			return;
		}

		const loaders = items.map(item => {
			return new Promise(resolve => {
				loadApplicasterChannel(item, (success, applicasterChannel) => {
					resolve(applicasterChannel)
				});
			});
		});

		Promise.all(loaders).then(applicasterChannels => {
			if (!applicasterChannels) {
				callback(false);
				return;
			}

			callback(true, applicasterChannels);
		})
		.catch(e => { callback(false) });
	}

	function loadApplicasterChannelList(callback) {
		const url = `${baseUrl}/collections/13261/items.json`;

		const request = getAuthRequest(url);

		axios(request).then(response => {
			var collection = response.data;
			if (!collection) {
				callback(false);
				return;
			}

			handleApplicasterChannelsCollection(collection, callback);
		})
		.catch(e => callback(false));
	}

	return new Promise((resolve, reject) => {
		loadApplicasterChannelList((result, applicasterChannels) => {
			if (!result || !applicasterChannels) {
				resolve(getChannelsFeed(null));
				return;
			}

			var channels = applicasterChannels.map(getChannelEntry);
			var feed = getChannelsFeed(channels);

			resolve(feed);
		});
	});
}
