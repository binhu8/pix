
require('dotenv').config()
const express = require('express');
const GNRequest = require('./apis/grencianet')
const bodyParser = require('body-parser')
const app = express()
let port = process.env.PORT || 2002


app.set('view engine', 'ejs');
app.set('views', 'src/views');
app.use(bodyParser.json())
const reqGNAlReady =  GNRequest()

app.post('/webhook(/pix)?', (req, res)=> {
    console.log(req.body)
    res.send(200)
})

app.get('/', async (req, res)=> {
    const reqGN = await reqGNAlReady
    const dataCob = {
        "calendario": {
          "expiracao": 3600
        },
        "devedor": {
          "cpf": "12345678909",
          "nome": "Francisco da Silva"
        },
        "valor": {
          "original": "1.00"
        },
        "chave": "binhudo8@gmail.com",
        "solicitacaoPagador": "teste pix."
      }

      

    const cobResponse = await reqGN.post('/v2/cob', dataCob)
    const qrCodeResponse = await reqGN(`/v2/loc/${cobResponse.data.loc.id}/qrcode`)
    
    res.render('qrcode', {qrcodeImage: qrCodeResponse.data.imagemQrcode})

})


app.listen(port, ()=> {
    console.log('servidor online')
})
