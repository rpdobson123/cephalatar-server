import express from 'express';
import hash from 'object-hash';
const replaceColor = require('replace-color')

const app = express()

const getFileByName = (name, color) => replaceColor({
    image: `./img/${name}.png`, colors: {
        type: 'hex',
        targetColor: '#FF00FF',
        replaceColor: color
    },
    deltaE: 20
});

const colors = [
    '#1f71c6',
    '#45a8e2',
    '#37d1d7',
    '#f1f1f1',
    '#ffdf9e',
    '#cc00cc',
    '#f05e23',
    '#68359c',
    '#fdbb58',
    '#f05e23',
    '#cb4154',
    '#aaa9ad',
];
app.get('/:hashable', async function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    const hashed = hash(req.params.hashable);
    const color = colors[hashed.charCodeAt(0) % 12];
    const [base, legs, face, acc] = await Promise.all([
        getFileByName(`base`, color),
        getFileByName(`leg${(hashed.charCodeAt(1) % 4) + 1}`, color),
        getFileByName(`face${(hashed.charCodeAt(2) % 5) + 1}`, color),
        getFileByName(`acc${(hashed.charCodeAt(3) % 5) + 1}`, color)
    ]);
    const clonedImg = base;
    clonedImg.blit(legs, 0, 0);
    clonedImg.blit(face, 0, 0);
    clonedImg.blit(acc, 0, 0);
    const blob = await clonedImg.resize(256, 256).getBase64Async('image/png')
    res.send(blob);
    return Promise.resolve();
})

app.listen(process.env.PORT || 3000)