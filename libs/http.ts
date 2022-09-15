import axios from 'axios'

class Http {
    static instance = axios.create()

    static async get(url: string) {
        const res = await this.instance.get(url)
        return res.data
    }
}

export default Http