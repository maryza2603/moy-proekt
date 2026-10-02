const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();
const p=await b.newPage({deviceScaleFactor:2});await p.goto('file://'+__dirname+'/covers.html',{waitUntil:'networkidle'});
await p.evaluate(()=>document.fonts.ready);
for(const id of ['c1','c2','c3','c4']) await (await p.$('#'+id)).screenshot({path:__dirname+`/kwork-${id}.png`});
await b.close();})();
