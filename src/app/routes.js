export default function (route) {
    const apiUrl = process.env.NODE_ENV === 'production' ? '/api' : "http://telematics.checkedout.kz/api";
    return apiUrl + route;
}