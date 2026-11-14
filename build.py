import re
s=open('game.src.html').read()
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
s=head+s+reg
open('index.html','w').write(s)
print(len(s))
