const { default: axios } = require("axios")

const CLIENT_BASE_API_URL = "https://unique-vibrancy-production.up.railway.app/api/v1/clients";
// const CLIENT_BASE_API_URL = "http://localhost:8080/api/v1/clients";

class ClientService {
    getAllClients() {
        return axios.get(CLIENT_BASE_API_URL);
    }

    createClient(client) {
        return axios.post(CLIENT_BASE_API_URL, client);
    }

    getClientById(id) {
        return axios.get(CLIENT_BASE_API_URL + "/" + id);
    }

    updateClient(id, client) {
        return axios.put(CLIENT_BASE_API_URL + "/" + id, client);
    }

    deleteClient(id, detail) {
        return axios.delete(CLIENT_BASE_API_URL + "/" + id, {
            data: {detail}
        });
    }
}

export default new ClientService();