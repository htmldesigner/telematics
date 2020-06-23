import axios from "axios";
import r from "./routes.js"

export default {

    dataPost(route, data, token, withFile) {

        let headers = {};
        if (token !== undefined) {
            headers['App-Token'] = token;
        }

        return {
            method: 'post',
            url: r(route),
            data: data,
            headers: headers,
            transformRequest: [(data) => {
                let fData = new FormData();
                for (let key in data) {
                    fData.set(key, data[key])
                }

                return fData;
            }],
        }
    },

    dataGet(route, token, params) {
        let addUrl = "";
        if (params !== undefined) {
            let pref = "?";
            for (let key in params) {
                addUrl += pref + key + "=" + params[key];
                pref = "&";
            }
        }
        return {
            method: 'get',
            url: r(route) + addUrl,
            headers: token === undefined ? null : {
                'App-Token': token
            },
        }
    },


    getObjects() {
        return axios(this.dataGet("/object/getgrouped"));
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
        return axios(this.dataPost('/geozone/savegeometry', { data: JSON.stringify({groupid:geozonegroupid, geozones: params })}))
    },
    getObjectsPosition(params) {
        return axios(this.dataPost('/object/getobjectsLastPosition', { ids: params }))
    },
    getObjectsPositionByImei(params) {
        return axios(this.dataPost('/object/getobjectsLastPositionByImei', { ids: params }))
    },
    getTracksFor(params, dateFrom, dateTo) {
        return axios(this.dataPost('/object/getobjectstrack', { ids: params, dateFrom: dateFrom, dateTo: dateTo }))
    },
    getTracksForv2(params, dateFrom, dateTo, speedLimit) {
        return axios(this.dataPost('/object/getobjectstrackv2', { ids: params, dateFrom: dateFrom, dateTo: dateTo,speedLimit: speedLimit }))
    },
    getStopsFor(params, dateFrom, dateTo) {
        return axios(this.dataPost('/stop/getstops', { id: params, dateFrom: dateFrom, dateTo: dateTo }))
    }
}