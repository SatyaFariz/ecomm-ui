import axios, { AxiosInstance } from 'axios'

class Http {
    private static instance: AxiosInstance = ((): AxiosInstance => {
        const instance = axios.create()
        instance.interceptors.request.use(
            async (config) => {
                const token = window.localStorage.getItem("token")
                if(token) {
                    config.headers = {
                        Authorization: `Bearer ${token}`,
                    }
                } else {
                    config.headers = {}
                }
                return config
            },
            (error) => {
                console.log(error)
                Promise.reject(error)
            }
        )

        instance.interceptors.response.use(function (response) {
            // Any status code that lie within the range of 2xx cause this function to trigger
            // Do something with response data
            return response
        }, function (error) {
            // Any status codes that falls outside the range of 2xx cause this function to trigger
            // Do something with response error

            if(error.response.status === 401) {
                // if user token has expired
                window.localStorage.removeItem('token')
            }

            return Promise.reject(error)
        })

        return instance
    })()

    static async get(url: string): Promise<any> {
        const res = await this.instance.get(url)
        return res.data
    }

    static async post(url: string, data?: any): Promise<any> {
        const res = await this.instance.post(url, data)
        return res.data
    }

    static async put(url: string, data?: any): Promise<any> {
        const res = await this.instance.put(url, data)
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