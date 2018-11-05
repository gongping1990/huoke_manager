import axios from '../http'

const banner = {
    // 获取首页banner
    listDefault () {
        return axios.get('/banner/listDefault')
    }
}

export default banner