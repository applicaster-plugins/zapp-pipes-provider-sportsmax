import axios from 'axios';
import moment from 'moment';

export function getEPG(params) {
	const SPORTSMAX_DATE_FORMAT = "YYYY-MM-DD HH:mm:ss";
	const DSP_DATE_FORMAT = "YYYY/MM/DD HH:mm:ss ZZ";

	function loadSportsMaxEPG(callback) {
		const baseUrl = "https://scheduler.sportsmax.tv/api/schedule";

		const startDay = moment().startOf('day');
		const nextDay = moment(startDay).add(3, 'days');

		const startParam = startDay.format(SPORTSMAX_DATE_FORMAT);
		const endParam = nextDay.format(SPORTSMAX_DATE_FORMAT);
		const channelId = params["channelId"];
	
		const request = {
			url: baseUrl,
			params: {
				"start": startParam,
				"end": endParam,
				"channel": channelId
			}
		};

		axios(request).then(response => {
			var epg = response.data;

			callback(true, epg);
		})
		.catch(e => callback(false));
	}

	function parseTime(value) {
		return moment(value).format(DSP_DATE_FORMAT);
	}

	function getProgramsFromCurrentTime(programs) {
		var result = [];

		var now = moment();
		
		var i;
		for (i = 0; i < programs.length; ++i) {
			var program = programs[i];
			
			var endTimeValue = program["end_time"];
			if (endTimeValue && moment(endTimeValue) > now) {
				result = programs.slice(i);
				break;
			}
		}

		return result
	}

	function getProgramEntry(epgItem) {
		var images = epgItem["image_assets"];

		return {
			"type": {
				"value": "program"
			},
			"id": epgItem["start"],
			"title": epgItem["name"],
			"author": {},
			"summary": epgItem["description"],
			"media_group": [
				{
					"type": "image",
					"media_item": [
						{
							"src": images ? images["image_base"] : "",
							"key": "image_base",
							"type": "image"
						}
					]
				}
			],
			"content": {},
			"extensions": {
				"starts_at": parseTime(epgItem["start_time"]),
				"ends_at": parseTime(epgItem["end_time"]),
				"show_name": epgItem["name"]
			}
		}
	}

	function getFeed(programs) {
		return {
			"type": {
				"value": "feed"
			},
			"id": "epg",
			"title": `SportMax EPG for`,
			"entry": programs || []
		}
	}

	return new Promise((resolve) => {
		loadSportsMaxEPG((success, epg) => {
			if (!success || !epg) {
				resolve(getFeed(null));
				return;
			}
			
			const allPrograms = epg["programs"];
			const programs = getProgramsFromCurrentTime(allPrograms).map(getProgramEntry);

			const feed = getFeed(programs);

			resolve(feed);
		});
	});
}
