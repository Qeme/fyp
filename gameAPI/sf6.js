// we put the cookies into jar within the request
import request from 'request-promise'
const cookieJar = request.jar()
request = request.defaults({jar: true})

async function main(){
    // get the main page first
    const result = await request.get('https://www.streetfighter.com/6/en-asia')
    console.log(cookieJar.getCookieString('https://www.streetfighter.com/6/en-asia'))
    const splittedByCsrfCookieName = cookieString.split('_csrf=')
    // then post the Authentication
    // const loginResult = await request.post('https://auth.cid.capcom.com/usernamepassword/login',
    // {
    //     // pass the credentials
    //     form: {
    //         username: 'johnrainbow07@gmail.com',
    //         password: '#Jugornut07'
    //     }
    // })
}

main()




































// const superagent = require('superagent').agent();

// const ytm = async () => {
//     try {
//         // Login request
//         let dashboard = await superagent.post('https://www.streetfighter.com/6/buckler/profile/auth').send({username: 'johnrainbow07@gmail.com', password: '#Jugornut07' }).set('Content-Type', 'application/json');

//         // Check response status
//         console.log('Login response status:', dashboard.status);

//         // Get request after login
//         // let news = await superagent.get('https://www.streetfighter.com/6/en-us/news/all/1');

//         // // Log response body
//         // console.log('News response body:', news.text);
//     } catch (error) {
//         console.error('Error:', error.message);
//     }
// }

// ytm();


// const url = 'https://www.streetfighter.com/6/buckler/profile/3154415329/battlelog?page=1'

// async function getTitle(){
//     try{

//         const response = await axios.get(url)
//         const $ = cheerio.load(response.data)
//         const title = $('/html/body/div/div/article[3]/div/div/h2/span').text()

//         console.log('Title is '+title)

//     }catch(error){
//         console.error(error)
//     }

// }



