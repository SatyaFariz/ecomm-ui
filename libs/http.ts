import axios from 'axios'

class Http {
    static instance = axios.create()

    static async get(url: string) {
        const res = await this.instance.get(url)
        return res.data
    }

    static async post(url: string, data: any) {
        const res = await this.instance.post(url, data)
        return res.data
    }
}

export default Http