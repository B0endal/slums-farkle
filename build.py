import re
import base64
s=open('game.src.html').read()
def ff(fam,wt,fn):
    b=base64.b64encode(open('fonts/'+fn,'rb').read()).decode()
    return '@font-face{font-family:"%s";font-weight:%s;font-style:normal;font-display:swap;src:url(data:font/woff2;base64,%s) format("woff2")}'%(fam,wt,b)
fonts='<style>'+ff('Pirata One',400,'pirata-one-latin-400-normal.woff2')+ff('Alegreya Sans',400,'alegreya-sans-latin-400-normal.woff2')+ff('Alegreya Sans',500,'alegreya-sans-latin-500-normal.woff2')+ff('Alegreya Sans',700,'alegreya-sans-latin-700-normal.woff2')+'</style>\n'
eng=open('engine.js').read()
names=open('dicenames.js').read()
dice=open('dice.json').read()
s=s.replace('/*__ENGINE__*/',eng).replace('/*__NAMES__*/',names).replace('/*__DICE__*/',dice)
head='''<!doctype html>
<html lang="de"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#101318">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Slums">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
'''
reg='''<script>
if ("serviceWorker" in navigator && /^https?:$/.test(location.protocol)) window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
</script>
'''
s=head+fonts+s+reg
open('index.html','w').write(s)
print(len(s))
