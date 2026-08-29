<?php
// router.php - Version corrigée
$request_uri = $_SERVER['REQUEST_URI'];

// Enlever les paramètres (?truc=chose) mais PAS les ancres (#)
// Les ancres ne sont jamais envoyées au serveur
$uri = parse_url($request_uri, PHP_URL_PATH);

// DEBUG (à enlever après)
// echo "<!-- URI reçue: " . $uri . " -->\n";

// Si c'est la racine, servir index.html
if ($uri === '/' || $uri === '') {
    return false;
}

// Nettoyer le chemin
$path = ltrim($uri, '/');

// Si le fichier existe directement (CSS, images, JS, etc.)
if (file_exists($path) && !is_dir($path)) {
    // Déterminer le type MIME
    $ext = pathinfo($path, PATHINFO_EXTENSION);
    $mimeTypes = [
        'css' => 'text/css',
        'js' => 'application/javascript',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'webp' => 'image/webp',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'json' => 'application/json',
        'xml' => 'application/xml',
        'pdf' => 'application/pdf',
        'txt' => 'text/plain'
    ];
    
    if (isset($mimeTypes[$ext])) {
        header('Content-Type: ' . $mimeTypes[$ext]);
    }
    readfile($path);
    exit;
}

// Vérifier si le fichier avec .html existe
if (file_exists($path . '.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($path . '.html');
    exit;
}

// Vérifier dans les sous-dossiers (ex: legal/mentions-legales)
$parts = explode('/', $path);
if (count($parts) > 1) {
    $last = array_pop($parts);
    $dir = implode('/', $parts);
    
    if (file_exists($dir . '/' . $last . '.html')) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($dir . '/' . $last . '.html');
        exit;
    }
}

// Vérifier si c'est un dossier avec index.html
if (is_dir($path) && file_exists($path . '/index.html')) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($path . '/index.html');
    exit;
}

// 404 - Page non trouvée
http_response_code(404);
header('Content-Type: text/html; charset=utf-8');
if (file_exists('404.html')) {
    readfile('404.html');
} else {
    echo '<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>404 - Page non trouvée</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { font-size: 48px; color: #333; }
            p { color: #666; }
            a { color: #007bff; text-decoration: none; }
        </style>
    </head>
    <body>
        <h1>404</h1>
        <p>Page non trouvée : ' . htmlspecialchars($uri) . '</p>
        <a href="/">Retour à l\'accueil</a>
    </body>
    </html>';
}
exit;
?>