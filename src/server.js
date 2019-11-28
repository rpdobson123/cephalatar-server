import express from 'express';
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
];
app.get('/:hashable', async function (req, res) {
    const hash = Buffer.from(req.params.hashable).toString('base64');
    const color = colors[hash.charCodeAt(0) % 5];
    const [base, legs, face, acc] = await Promise.all([
        getFileByName(`base`, color),
        getFileByName(`leg${(hash.charCodeAt(1) % 4) + 1}`, color),
        getFileByName(`face${(hash.charCodeAt(2) % 5) + 1}`, color),
        getFileByName(`acc${(hash.charCodeAt(3) % 5) + 1}`, color)
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