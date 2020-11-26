import axios from 'axios';
import r from './routes.js';
import { eventBus } from '@/eventBus';

export default {
	dataPost(route, data, token, withFile) {
		if (!data.hasOwnProperty('isIndicatorRequired')) {
			data.isIndicatorRequired = true;
		}
		return {
			method: 'post',
			url: r(route),
			data: data,
			isIndicatorRequired: data.isIndicatorRequired,
			transformRequest: [
				data => {
					let fData = new FormData();
					for (let key in data) {
						fData.set(key, data[key]);
					}

					return fData;
				},
			],
		};
	},


	// Routes
	addRoute(params, isIndicatorRequired = true){
		return axios({
			method: 'post',
			url: r('/route/addroute'),
			data: params,
			isIndicatorRequired: isIndicatorRequired
		});
	},

	getRouteList(){
		return axios(this.dataGet('/route/list'))
	},


	dataGet(route, token, params) {
		let addUrl = '';
		if (params !== undefined) {
			let pref = '?';
			for (let key in params) {
				addUrl += pref + key + '=' + params[key];
				pref = '&';
			}
			if (!params.hasOwnProperty('isIndicatorRequired')) {
				params.isIndicatorRequired = true;
			}
		} else {
			params = {};
			params.isIndicatorRequired = true;
		}
		return {
			method: 'get',
			//isIndicatorRequired: params.isIndicatorRequired,
			url: r(route) + addUrl,
		};
	},

	authPost(route, data, token, withFile) {
		if (!data.hasOwnProperty('isIndicatorRequired')) {
			data.isIndicatorRequired = true;
		}
		return {
			method: 'post',
			url: r(route),
			data: data,
		};
	},

	auth(user) {
		return axios(this.authPost('/mobile/authorization', user))
	},

	// Load objects
	getObjectsWorkSet() {
		return axios(this.dataGet("/object/getgrouped"));
	},
	addToWorkset(params) {
		return axios(this.dataPost('/object/addToWorkset', { ids: params, isIndicatorRequired:false }))
	},

	removeFromWorkset(params) {
		return axios(this.dataPost('/object/removeFromWorkset', { ids: params, isIndicatorRequired:false }))
	},
	listObjects(params) {
		params.isIndicatorRequired = false;
		return axios(this.dataPost('/object/listobjects', params))
	},
	addGroupToWorkset(params) {
		return axios(this.dataPost('/object/addGroupToWorkset', { ids: params, isIndicatorRequired:false }))
	},
	removeGroupFromWorkset(params) {
		return axios(this.dataPost('/object/removeGroupFromWorkset', { ids: params, isIndicatorRequired:false }))
	},
	listGroups(params) {
		params.isIndicatorRequired =false;
		return axios(this.dataPost('/object/listGroups',params))
	},


// Load geoZone
	getGeozonesWorkSet() {
		return axios(this.dataGet("/geozone/getgrouped"));
	},
	addGeozoneToWorkset(params) {
		return axios(this.dataPost('/geozone/addToWorkset', { ids: params, isIndicatorRequired:false }))
	},
	removeGeozoneFromWorkset(params) {
		return axios(this.dataPost('/geozone/removeFromWorkset', { ids: params, isIndicatorRequired:false }))
	},
	listGeozones(params) {
		params.isIndicatorRequired =false;
		return axios(this.dataPost('/geozone/listGeozones', params))
	},
	listGeozoneGroups(params) {
		params.isIndicatorRequired =false;
		return axios(this.dataPost('/geozone/listGroups',params))
	},
	addGeozoneGroupToWorkset(params) {
		return axios(this.dataPost('/geozone/addGroupToWorkset', { ids: params, isIndicatorRequired:false }))
	},
	removeGeozoneGroupFromWorkset(params) {
		return axios(this.dataPost('/geozone/removeGroupFromWorkset', { ids: params, isIndicatorRequired:false }))
	},





	getGeozone(id) {
		return axios(this.dataGet("/geozone/get/"+id));
	},
	getGeozones() {
		return axios(this.dataGet("/geozone/getgrouped/"));
	},

	getUserInfo() {
		return axios(this.dataGet("/user/getUserInfo/"));
	},
	saveUserInfo(userinfo){
		return axios({
			method: 'post',
			url: r('/user/saveUserInfo'),
			data: userinfo,
			isIndicatorRequired: true
		});
	},
	getUserPermission() {
		return axios(this.dataGet("/user/getUserPermission/"));
	},
	setGeozone(layer) {
		return axios(this.dataPost("/geozone/creategeozone/",{layer:layer}));
	},
	getGeozonesTree(id) {
		return axios(this.dataGet("/geozone/getgroup/"+id));
	},
	saveGeozoneGeometry(geozonegroupid,params) {
		//return axios.post('/geozone/savegeometry/', {data:JSON.stringify({groupid:geozonegroupid, geozones: params })})
		return axios(this.dataPost('/geozone/savegeometry', { data: JSON.stringify({groupid:geozonegroupid, geozones: params }), isIndicatorRequired:true}))
	},
	saveState(statesaved){
		return axios(this.dataPost('/user/savestate', { state: JSON.stringify(statesaved)}));
	},
	loadState(statesaved){
		return axios(this.dataGet('/user/getstate'));
	},
	getObjectsPosition(params) {
		return axios(this.dataPost('/object/getobjectsLastPosition', { ids: params, isIndicatorRequired:false }))
	},
	getObjectsPositionByDeviceId(params) {
		return axios(this.dataPost('/object/getobjectsLastPositionByDeviceId', { device_ids: params, isIndicatorRequired:false }))
	},
	getTracksFor(params, dateFrom, dateTo) {
		return axios(this.dataPost('/object/getobjectstrack', { ids: params, dateFrom: dateFrom, dateTo: dateTo }))
	},
	getTracksForv2(params, dateFrom, dateTo, speedLimit,stops, overspeed) {
		return axios(this.dataPost('/object/getobjectstrackv2', { ids: params, dateFrom: dateFrom, dateTo: dateTo,speedLimit: speedLimit, stops:stops, overspeed:overspeed }))
	},
	getStopsFor(params, dateFrom, dateTo) {
		return axios(this.dataPost('/stop/getstops', { id: params, dateFrom: dateFrom, dateTo: dateTo }))
	},
	serviceQuery(params, isIndicatorRequired = true){
		return axios({
			method: 'post',
			url: r('/service/getservice'),
			data: params,
			isIndicatorRequired: isIndicatorRequired
		});
	},
	planReport(params, isIndicatorRequired = true){
		return axios({
			method: 'post',
			url: r('/service/planreport'),
			data: params,
			isIndicatorRequired: isIndicatorRequired
		});
	},
	///make linestring geojson
	makeGeoJson(points){
		let result ={
			type:"LineString",
			coordinates:[]
		};
		let l = 0;
		while (points.length > l) {
			let [lt, ln, speed, fix_date, course] = points[l];
			result.coordinates.push([lt,ln]);
			l++;
		}
		return result;
	},

	getKey(key, defaultValue) {
		let value = localStorage.getItem(key) || JSON.stringify(defaultValue);
		try {
			return JSON.parse(value);
		} catch (e) {
			return defaultValue;
		}
	}

};
