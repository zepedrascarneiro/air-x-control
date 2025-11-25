// Service Worker para Air X Control PWA
const CACHE_NAME = 'airx-control-v1';
const OFFLINE_URL = '/offline.html';

// Recursos para cachear imediatamente
const PRECACHE_ASSETS = [
  '/',
  '/dashboard',
  '/login',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/apple-touch-icon.png',
  '/airx-logo.svg',
  '/offline.html'
];

// Instala o Service Worker e faz cache dos recursos
self.addEventListener('install', (event) => {
  console.log('[SW] Instalando Service Worker...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cacheando recursos...');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => {
        console.log('[SW] Recursos cacheados com sucesso!');
        return self.skipWaiting();
      })
      .catch((err) => {
        console.error('[SW] Erro ao cachear:', err);
      })
  );
});

// Ativa o Service Worker e limpa caches antigos
self.addEventListener('activate', (event) => {
  console.log('[SW] Ativando Service Worker...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => {
              console.log('[SW] Removendo cache antigo:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker ativado!');
        return self.clients.claim();
      })
  );
});

// Estratégia: Network First, fallback para Cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignora requests que não são GET
  if (request.method !== 'GET') {
    return;
  }

  // Ignora requests para APIs (sempre buscar do servidor)
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Ignora requests externos
  if (url.origin !== location.origin) {
    return;
  }

  event.respondWith(
    // Tenta buscar da rede primeiro
    fetch(request)
      .then((response) => {
        // Se sucesso, salva no cache e retorna
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseClone);
            });
        }
        return response;
      })
      .catch(async () => {
        // Se falhar, tenta buscar do cache
        const cachedResponse = await caches.match(request);
        
        if (cachedResponse) {
          return cachedResponse;
        }

        // Se for navegação, mostra página offline
        if (request.mode === 'navigate') {
          const offlineResponse = await caches.match(OFFLINE_URL);
          if (offlineResponse) {
            return offlineResponse;
          }
        }

        // Retorna erro genérico
        return new Response('Offline - Conteúdo não disponível', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      })
  );
});

// Listener para push notifications (futuro)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    
    const options = {
      body: data.body || 'Nova notificação do Air X Control',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/icon-72x72.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/dashboard'
      },
      actions: [
        {
          action: 'open',
          title: 'Abrir'
        },
        {
          action: 'close',
          title: 'Fechar'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Air X Control', options)
    );
  }
});

// Ação quando clica na notificação
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'close') {
    return;
  }

  const urlToOpen = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then((clientList) => {
        // Se já tem uma janela aberta, foca nela
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            client.navigate(urlToOpen);
            return client.focus();
          }
        }
        // Senão, abre uma nova
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      })
  );
});

// Sincronização em background (futuro)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-flights') {
    console.log('[SW] Sincronizando voos pendentes...');
    // Implementar sincronização de dados offline
  }
});

console.log('[SW] Service Worker carregado!');
