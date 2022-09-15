import axios, { AxiosInstance } from 'axios'

class Http {
    static instance: AxiosInstance = axios.create()

    static async get(url: string): Promise<any> {
        const res = await this.instance.get(url)
        return res.data
    }

    static async post(url: string, data: any): Promise<any> {
        const res = await this.instance.post(url, data)
        return res.data
    }

    static setHeader(key: string, value: string): void {
        this.instance.defaults.headers.common[key] = value
    }

    static removeHeader(key: string): void {
        delete this.instance.defaults.headers.common[key]
    }
}

export default Http