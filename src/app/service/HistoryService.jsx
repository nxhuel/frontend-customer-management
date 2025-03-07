const { default: axios } = require("axios")

const HISTORY_BASE_API_URL = "https://unique-vibrancy-production.up.railway.app/api/v1/history";
// const HISTORY_BASE_API_URL = "http://localhost:8080/api/v1/history";

class HistoryService {
    getAllHistory() {
        return axios.get(HISTORY_BASE_API_URL);
    }

    getHistoryById(id) {
        return axios.get(HISTORY_BASE_API_URL + "/" + id);
    }
}

export default new HistoryService();