let cacheName = 'v1';
//service-worker 主要處理離線時暫存
//三個事件處理器 
self.addEventListener('install', function (event) { //install 用戶要去安裝
	console.log('install:', event);
	event.waitUntil(  //waitUntil非同步的方法
		caches.open(cacheName).then((cache) => {   //caches 在service-work才有
			return cache.addAll([ //把這三個檔案放到暫存區 都是promise
				'/myApp/canvas-draw-app.html',
				'/myApp/manifest.json',
				'/myApp/images/icons/icon-144x144.png',
			]);
		})
	);
});

self.addEventListener('activate', event => { //activate啟動時候做什麼 
	console.log('activate:', event);
	event.waitUntil(
		caches.keys().then(keyList => { //主要是刪掉舊版的
			return Promise.all(keyList.map(key => {
				if (key !== cacheName) {
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener('fetch', function (event) { //載入內容
	console.log('fetch:', event); // 查看 chrome://inspect/#service-workers
	event.respondWith(
		caches.match(event.request).then((response) => {
			return response || fetch(event.request);
		})
	);
});